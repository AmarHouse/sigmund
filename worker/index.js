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

    // Stripe webhook
    if (url.pathname === '/stripe-webhook' && request.method === 'POST') {
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

    // User session endpoint
    if (url.pathname === '/api/session' && request.method === 'GET') {
      return handleSessionCheck(request, env);
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  },
};

async function handleStripeWebhook(request, env) {
  try {
    const body = await request.json();
    const event = body.type || '';

    if (event === 'checkout.session.completed' || event === 'invoice.paid') {
      const session = body.data?.object || {};
      const customerId = session.customer;
      const plan = session.metadata?.plan || session.metadata?.tier || 'premium';

      // Update user plan in KV - we need to find the user by stripe customer ID
      // This will be implemented when Stripe is integrated
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
