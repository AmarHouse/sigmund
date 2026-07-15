const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  const userId = request.headers.get('X-User-Id') || 'anonymous';
  const data = env.SESSIONS ? await env.SESSIONS.get(`user:${userId}`, 'json') : null;

  const month = new Date().toISOString().slice(0, 7);
  const sessionsThisMonth = data?.month === month ? (data?.sessions || 0) : 0;

  return new Response(JSON.stringify({
    loggedIn: !!userId && userId !== 'anonymous',
    name: data?.name || '',
    email: data?.email || '',
    plan: data?.plan || 'free',
    sessionsUsed: sessionsThisMonth,
    extraAvailable: data?.extra_available || 0,
    lastSession: data?.last_session || null,
  }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
}
