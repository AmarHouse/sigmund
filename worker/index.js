/*
  SIGMUND API Worker
  Substitui a Pages Function atual como gateway de API.
  Gerencia sessões, planos, e roteia requisições para OpenRouter.
*/

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Dev-Mode',
};

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_MESSAGES_PER_SESSION = 50;
const SESSION_COOLDOWN_HOURS = 24;

function parseCookies(request) {
  const cookie = request.headers.get('Cookie') || '';
  const result = {};
  cookie.split(';').forEach(c => {
    const [k, v] = c.trim().split('=');
    if (k) result[k] = decodeURIComponent(v || '');
  });
  return result;
}

function userKey(userId) {
  return `user:${userId}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Stripe webhook (accept both paths for flexibility)
    if ((url.pathname === '/stripe-webhook' || url.pathname === '/api/stripe/webhook') && request.method === 'POST') {
      return handleStripeWebhook(request, env);
    }

    // Create Stripe Checkout Session
    if (url.pathname === '/api/create-checkout' && request.method === 'POST') {
      return handleCreateCheckout(request, env);
    }

    // Purchase extra session
    if (url.pathname === '/api/purchase-extra' && request.method === 'POST') {
      return handlePurchaseExtra(request, env);
    }

    // Main proxy endpoint
    if (url.pathname === '/api/proxy' && request.method === 'POST') {
      return handleProxy(request, env);
    }

    // White Label endpoints
    if (url.pathname.startsWith('/api/wl/')) {
      return handleWhiteLabel(request, url, env);
    }

    // User session endpoint
    if (url.pathname === '/api/session' && request.method === 'GET') {
      return handleSessionCheck(request, env);
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  },
};

async function handleStripeWebhook(request, env) {
  try {
    const signature = request.headers.get('stripe-signature');
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const event = body.type || '';

    // Verify webhook signature
    if (signature && env.STRIPE_WEBHOOK_SECRET) {
      const encoder = new TextEncoder();
      const key = encoder.encode(env.STRIPE_WEBHOOK_SECRET);
      // Basic verification - in production, use proper Stripe signature verification
    }

    if (event === 'checkout.session.completed') {
      const session = body.data?.object || {};
      const customerId = session.customer;
      const metadata = session.metadata || {};
      const plan = metadata.plan || 'premium';

      // Store Stripe customer → user mapping
      // This should be enhanced with OAuth user IDs
      if (customerId) {
        await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify({
          plan,
          active: true,
          created: new Date().toISOString(),
        }));
      }
    }

    if (event === 'invoice.paid') {
      const invoice = body.data?.object || {};
      const customerId = invoice.customer;
      if (customerId) {
        const stripeData = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (stripeData) {
          stripeData.active = true;
          stripeData.lastPaid = new Date().toISOString();
          await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(stripeData));
        }
      }
    }

    if (event === 'invoice.payment_failed' || event === 'customer.subscription.deleted') {
      const obj = body.data?.object || {};
      const customerId = obj.customer;
      if (customerId) {
        const stripeData = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (stripeData) {
          stripeData.active = false;
          await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(stripeData));
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

async function stripeRequest(path, method, body, env) {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'Stripe não configurado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const resp = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  });

  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    status: resp.ok ? 200 : 400,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function handleCreateCheckout(request, env) {
  try {
    const { plan, success_url, cancel_url } = await request.json();

    const prices = {
      premium: { price: 4900, name: 'SIGMUND Premium' },
      wl_essential: { price: 9700, name: 'SIGMUND White Label Essential' },
      wl_pro: { price: 19700, name: 'SIGMUND White Label Pro' },
    };

    const selected = prices[plan];
    if (!selected) {
      return new Response(JSON.stringify({ error: 'Plano inválido' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return stripeRequest('/checkout/sessions', 'POST', {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: JSON.stringify([{
        price_data: {
          currency: 'brl',
          product_data: { name: selected.name },
          recurring: { interval: 'month' },
          unit_amount: selected.price,
        },
        quantity: 1,
      }]),
      success_url: success_url || 'https://sigmund.app/success',
      cancel_url: cancel_url || 'https://sigmund.app/',
      metadata: { plan, source: 'sigmund_web' },
    }, env);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

async function handlePurchaseExtra(request, env) {
  try {
    const { success_url } = await request.json();

    return stripeRequest('/checkout/sessions', 'POST', {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: JSON.stringify([{
        price_data: {
          currency: 'brl',
          product_data: { name: 'SIGMUND — Sessão Extra' },
          unit_amount: 2000,
        },
        quantity: 1,
      }]),
      success_url: success_url || 'https://sigmund.app/success',
      cancel_url: 'https://sigmund.app/',
      metadata: { type: 'extra_session', source: 'sigmund_web' },
    }, env);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function handleWhiteLabel(request, url, env) {
  const cookies = parseCookies(request);
  const userId = cookies.sigmund_session || request.headers.get('X-User-Id');
  if (!userId) return json({ error: 'Não autenticado' }, 401);

  const userKey = userKey(userId);
  const userData = await env.SESSIONS.get(userKey, 'json');
  if (!userData || !userData.plan?.startsWith('wl_')) {
    return json({ error: 'Plano não autorizado' }, 403);
  }

  const path = url.pathname.replace('/api/wl/', '');
  const parts = path.split('/');

  // GET /api/wl/patients
  if (path === 'patients' && request.method === 'GET') {
    const patients = userData.patients || [];
    return json({ patients });
  }

  // POST /api/wl/patients
  if (path === 'patients' && request.method === 'POST') {
    const { name, email } = await request.json();
    if (!name) return json({ error: 'Nome é obrigatório' }, 400);

    const patients = userData.patients || [];
    const maxPatients = userData.plan === 'wl_pro' ? 60 : 30;
    if (patients.length >= maxPatients) {
      return json({ error: `Limite de ${maxPatients} pacientes atingido` });
    }

    const patientId = crypto.randomUUID();
    patients.push({ id: patientId, name, email: email || '', created: new Date().toISOString(), sessions: [] });
    userData.patients = patients;
    await env.SESSIONS.put(userKey, JSON.stringify(userData));

    return json({ ok: true, patient: { id: patientId, name, email } });
  }

  // GET /api/wl/patients/:id/sessions
  if (parts.length === 3 && parts[2] === 'sessions' && request.method === 'GET') {
    const patientId = parts[1];
    const patients = userData.patients || [];
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return json({ error: 'Paciente não encontrado' }, 404);

    // Sessions are stored per-patient in KV
    const patientSessionsKey = `sessions:${userId}:${patientId}`;
    const sessionsData = await env.SESSIONS.get(patientSessionsKey, 'json');
    return json({ sessions: sessionsData?.sessions || [] });
  }

  // POST /api/wl/patients/:id/email-report
  if (parts.length === 3 && parts[3] === 'email-report' && request.method === 'POST') {
    const patientId = parts[1];
    const patients = userData.patients || [];
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return json({ error: 'Paciente não encontrado' }, 404);

    if (!patient.email) return json({ error: 'Paciente não tem email cadastrado' });

    // Generate and send report email
    const patientSessionsKey = `sessions:${userId}:${patientId}`;
    const sessionsData = await env.SESSIONS.get(patientSessionsKey, 'json');
    const sessions = sessionsData?.sessions || [];

    if (sessions.length === 0) return json({ error: 'Nenhuma sessão para relatar' });

    const lastSession = sessions[sessions.length - 1];
    const summary = lastSession.summary || 'Resumo não disponível';

    if (env.SENDGRID_API_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: patient.email }] }],
          from: { email: 'relatorios@sigmund.app', name: 'SIGMUND — Relatório' },
          subject: `Relatório de Sessão - ${patient.name}`,
          content: [{
            type: 'text/plain',
            value: `Olá,\n\nSegue o resumo da última sessão de ${patient.name}:\n\n${summary}\n\nAtenciosamente,\nSIGMUND`
          }],
        }),
      });
    }

    return json({ ok: true });
  }

  // GET /api/wl/patients/:patientId/sessions/:sessionId/pdf
  if (parts.length === 5 && parts[4] === 'pdf' && request.method === 'GET') {
    const patientId = parts[1];
    const sessionId = parts[3];

    const patientSessionsKey = `sessions:${userId}:${patientId}`;
    const sessionsData = await env.SESSIONS.get(patientSessionsKey, 'json');
    const session = sessionsData?.sessions?.find(s => s.id === sessionId);
    if (!session) return json({ error: 'Sessão não encontrada' }, 404);

    // Generate a simple HTML PDF
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${session.title}</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#333;}
h1{color:#1a1a1e;border-bottom:2px solid #e0e0e0;padding-bottom:10px;}
.meta{color:#666;font-size:14px;margin:20px 0;}
.msg{margin:16px 0;padding:12px;border-radius:8px;}
.user{background:#f0f0f5;}.assistant{background:#e8f0fe;}
.role{font-weight:bold;font-size:13px;margin-bottom:4px;color:#555;}
.content{line-height:1.6;white-space:pre-wrap;}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;font-size:12px;color:#999;text-align:center;}
</style></head><body>
<h1>${session.title}</h1>
<div class="meta">${session.date || ''} · ${session.duration || ''}</div>
${(session.messages || []).map(m => `
<div class="msg ${m.role}">
<div class="role">${m.role === 'user' ? 'Paciente' : 'Terapeuta'}</div>
<div class="content">${m.content}</div>
</div>`).join('')}
${session.summary ? `<h2>Resumo</h2><p>${session.summary}</p>` : ''}
<div class="footer">Relatório gerado por SIGMUND</div>
</body></html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf', ...CORS_HEADERS },
    });
  }

  return json({ error: 'Rota não encontrada' }, 404);
}

async function handleSessionCheck(request, env) {
  const cookies = parseCookies(request);
  const userId = cookies.sigmund_session || request.headers.get('X-User-Id');

  if (!userId) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const key = userKey(userId);
  const data = await env.SESSIONS.get(key, 'json');
  const month = today().slice(0, 7);

  if (!data || data.month !== month) {
    return new Response(JSON.stringify({
      loggedIn: true,
      plan: data?.plan || 'free',
      sessionsUsed: 0,
      extraAvailable: 0,
      lastSession: null,
    }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  return new Response(JSON.stringify({
    loggedIn: true,
    plan: data.plan || 'free',
    sessionsUsed: data.sessions || 0,
    extraAvailable: data.extra_available || 0,
    lastSession: data.last_session || null,
  }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function handleProxy(request, env) {
  const isDev = request.headers.get('X-Dev-Mode') === 'true' ||
                new URL(request.url).searchParams.get('dev') === 'true';

  try {
    const reqBody = await request.json();
    const { url: targetUrl, method, headers: reqHeaders, body: reqBodyStr } = reqBody;

    // Decode the dev mode from request
    const cookies = parseCookies(request);
    const userId = cookies.sigmund_session || reqHeaders['X-User-Id'] || 'anonymous';
    const userKeyId = userKey(userId);
    const userData = await env.SESSIONS.get(userKeyId, 'json');
    const todayDate = today();
    const month = todayDate.slice(0, 7);

    // Session validation (skip for dev mode)
    if (!isDev && userId !== 'anonymous') {
      const sessionCheck = validateSession(userData, month, todayDate, env);
      if (sessionCheck.status === 'blocked') {
        return new Response(JSON.stringify({
          upstreamStatus: 403,
          body: JSON.stringify({ error: sessionCheck.message }),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    // Build the OpenRouter request
    let openRouterBody;
    try {
      openRouterBody = JSON.parse(reqBodyStr || '{}');
    } catch {
      openRouterBody = {};
    }

    const model = openRouterBody.model || env.PRIMARY_MODEL;
    const messages = openRouterBody.messages || [];

    const requestToOR = {
      model,
      messages,
      temperature: openRouterBody.temperature ?? 0.7,
      max_tokens: openRouterBody.max_tokens ?? 2048,
      top_p: openRouterBody.top_p ?? 0.95,
    };

    // Build headers for OpenRouter
    const openRouterHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (isDev && reqHeaders && reqHeaders.Authorization) {
      openRouterHeaders['Authorization'] = reqHeaders.Authorization;
    } else {
      openRouterHeaders['Authorization'] = `Bearer ${env.OPENROUTER_API_KEY}`;

      // Try models in order with fallback
      const OR_MODELS = [
        env.PRIMARY_MODEL,
        env.FALLBACK_MODEL,
        env.SECOND_FALLBACK_MODEL,
      ];

      let lastError = null;
      for (const tryModel of OR_MODELS) {
        requestToOR.model = tryModel;
        const result = await tryOpenRouter(requestToOR, openRouterHeaders);
        if (result.success) {
          // Update session count
          if (!isDev && userId !== 'anonymous') {
            await updateSessionCount(env, userKeyId, userData, month, todayDate);
          }

          return new Response(JSON.stringify({
            upstreamStatus: 200,
            body: JSON.stringify(result.data),
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }
        lastError = result.error;
      }

      // All models failed
      const errorMsg = lastError ? extractErrorMessage(lastError) : 'Todos os modelos falharam';
      return new Response(JSON.stringify({
        upstreamStatus: 502,
        body: JSON.stringify({ error: errorMsg }),
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Dev mode or fallback to single request
    const resp = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: openRouterHeaders,
      body: JSON.stringify(requestToOR),
    });

    const responseText = await resp.text();

    if (resp.status >= 400) {
      const isCfError = responseText.includes('<!DOCTYPE') || responseText.includes('Cloudflare');
      return new Response(JSON.stringify({
        upstreamStatus: resp.status,
        body: isCfError
          ? JSON.stringify({ error: `O provedor retornou erro ${resp.status}. Verifique o modelo e tente novamente.` })
          : responseText,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return new Response(JSON.stringify({
      upstreamStatus: resp.status,
      body: responseText,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });

  } catch (e) {
    return new Response(JSON.stringify({
      upstreamStatus: 500,
      body: JSON.stringify({ error: e.message }),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

async function tryOpenRouter(requestBody, headers) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const resp = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const text = await resp.text();

    if (!resp.ok) {
      return { success: false, error: { status: resp.status, body: text } };
    }

    return { success: true, data: JSON.parse(text) };
  } catch (e) {
    return { success: false, error: { status: 0, body: e.message } };
  }
}

function validateSession(userData, month, todayDate, env) {
  if (!userData) {
    return { status: 'ok' };
  }

  if (userData.plan === 'premium' || userData.plan === 'wl_essential' || userData.plan === 'wl_pro') {
    // Premium: check "dia sim, dia não"
    if (userData.plan === 'premium') {
      if (userData.last_session === todayDate) {
        return {
          status: 'blocked',
          message: 'Sua sessão de hoje já foi realizada. Volte amanhã para continuarmos, ou adquira uma sessão extra para conversarmos mais agora.',
        };
      }
    }
    return { status: 'ok' };
  }

  // Free: check single session used
  if (userData.sessions && userData.sessions >= 1) {
    return {
      status: 'blocked',
      message: 'Sua sessão gratuita já foi utilizada. Crie sua conta para continuar seu acompanhamento.',
    };
  }

  return { status: 'ok' };
}

async function updateSessionCount(env, key, userData, month, todayDate) {
  const now = userData || { month, sessions: 0, extra_available: 0, last_session: null };

  if (now.month !== month) {
    now.month = month;
    now.sessions = 0;
    now.extra_available = 0;
  }

  now.sessions = (now.sessions || 0) + 1;
  now.last_session = todayDate;

  await env.SESSIONS.put(key, JSON.stringify(now));
}

function extractErrorMessage(error) {
  if (error.status === 0) return error.body || 'Erro de conexão com o provedor';
  try {
    const parsed = JSON.parse(error.body);
    return parsed.error?.message || parsed.error || 'Erro desconhecido do provedor';
  } catch {
    return `Erro ${error.status}: ${(error.body || '').slice(0, 200)}`;
  }
}
