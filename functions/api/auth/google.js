const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-User-Id' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  try {
    const { credential, clientId } = await request.json();

    // Validate token with Google
    const tokenResp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!tokenResp.ok) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
    }

    const payload = await tokenResp.json();

    // Verify audience (client ID)
    if (payload.aud !== clientId && payload.aud !== env.GOOGLE_CLIENT_ID) {
      return new Response(JSON.stringify({ error: 'Token não pertence a este aplicativo' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
    }

    const userId = `google:${payload.sub}`;
    const email = payload.email || '';
    const name = payload.name || email.split('@')[0] || 'Usuário';

    // Store user in KV
    if (env.SESSIONS) {
      const existing = await env.SESSIONS.get(`user:${userId}`, 'json');
      await env.SESSIONS.put(`user:${userId}`, JSON.stringify({
        email,
        name,
        picture: payload.picture || '',
        created: existing?.created || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        plan: existing?.plan || 'free',
        sessions: existing?.sessions || 0,
        extra_available: existing?.extra_available || 0,
        month: existing?.month || new Date().toISOString().slice(0, 7),
      }));
    }

    return new Response(JSON.stringify({
      ok: true,
      user: { id: userId, name, email, picture: payload.picture || '' },
    }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}
