const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Dev-Mode, X-User-Id',
};

const MAX_MESSAGES = 50;
const SESSION_COOLDOWN_HOURS = 24;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }

  const isDev = request.headers.get('X-Dev-Mode') === 'true';

  try {
    const { url, method, headers, body } = await request.json();

    // Dev mode - use BYOK
    if (isDev) {
      const resp = await fetch(url, {
        method: method || 'POST',
        headers: { ...headers, 'Accept': 'application/json' },
        body: body || undefined,
      });
      const text = await resp.text();
      return proxyResponse(resp.status, text, CORS);
    }

    // Production mode - route through OpenRouter with master key
    let reqBody;
    try { reqBody = JSON.parse(body || '{}'); } catch { reqBody = {}; }

    // Session control
    const userId = request.headers.get('X-User-Id') || '';
    if (userId && env.SESSIONS) {
      const userData = await env.SESSIONS.get(`user:${userId}`, 'json');
      if (userData) {
        const month = new Date().toISOString().slice(0, 7);
        if (userData.month !== month) {
          userData.month = month;
          userData.sessions = 0;
        }
        const today = new Date().toISOString().slice(0, 10);

        // Free users: 1 session only
        if (userData.plan === 'free' && userData.sessions >= 1 && !userData.extra_available) {
          return new Response(JSON.stringify({
            upstreamStatus: 403,
            body: JSON.stringify({ error: 'Sua sessão gratuita já foi utilizada. Crie sua conta e escolha um plano para continuar.', upsell: true }),
          }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
        }

        // Premium: check "dia sim, dia não"
        if (userData.plan === 'premium' && userData.last_session === today) {
          return new Response(JSON.stringify({
            upstreamStatus: 403,
            body: JSON.stringify({ error: 'Sua sessão de hoje já foi realizada. Volte amanhã para continuarmos, ou adquira uma sessão extra.', upsell: true, extra: true }),
          }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
        }

        // Update session count
        userData.sessions = (userData.sessions || 0) + 1;
        userData.last_session = today;
        await env.SESSIONS.put(`user:${userId}`, JSON.stringify(userData));
      }
    }

    const masterKey = env.OPENROUTER_API_KEY;
    if (!masterKey) {
      return new Response(JSON.stringify({
        upstreamStatus: 502,
        body: JSON.stringify({ error: 'API key não configurada' }),
      }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
    }

    // Modelos gratuitos para testes (OpenRouter free route)
    // Produção: deepseek/deepseek-v4-flash
    const OR_MODELS = [
      env.PRIMARY_MODEL || 'openrouter/free',
      env.FALLBACK_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
      env.SECOND_FALLBACK_MODEL || 'qwen/qwen3-next-80b-a3b-instruct:free',
    ];

    let lastError = null;
    for (const model of OR_MODELS) {
      const orBody = {
        model,
        messages: reqBody.messages || [],
        temperature: reqBody.temperature ?? 0.7,
        max_tokens: reqBody.max_tokens ?? 2048,
        top_p: reqBody.top_p ?? 0.95,
      };

      const orResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${masterKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(orBody),
      });

      const orText = await orResp.text();
      if (orResp.ok) {
        return proxyResponse(orResp.status, orText, CORS);
      }
      lastError = { status: orResp.status, body: orText };
    }

    const errMsg = lastError ? extractErrorMessage(lastError) : 'Todos os modelos falharam';
    return new Response(JSON.stringify({
      upstreamStatus: 502,
      body: JSON.stringify({ error: errMsg }),
    }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

  } catch (e) {
    return new Response(JSON.stringify({
      upstreamStatus: 500,
      body: JSON.stringify({ error: e.message }),
    }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}

function proxyResponse(status, text, cors) {
  if (status >= 400) {
    const isCfError = text.includes('<!DOCTYPE') || text.includes('Cloudflare') || text.trim() === '404 page not found';
    const clean = isCfError
      ? JSON.stringify({ error: `O provedor retornou erro ${status}. Verifique o modelo e tente novamente.` })
      : text;
    return new Response(JSON.stringify({ upstreamStatus: status, body: clean }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
  return new Response(JSON.stringify({ upstreamStatus: status, body: text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function extractErrorMessage(err) {
  if (!err || !err.body) return 'Erro desconhecido do provedor';
  try {
    const parsed = JSON.parse(err.body);
    return parsed.error?.message || parsed.error || `Erro ${err.status}`;
  } catch {
    return `Erro ${err.status}: ${err.body.slice(0, 200)}`;
  }
}
