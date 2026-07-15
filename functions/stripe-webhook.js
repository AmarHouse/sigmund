const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const event = body.type || '';

    if (event === 'checkout.session.completed') {
      const session = body.data?.object || {};
      const customerId = session.customer;
      const plan = session.metadata?.plan || 'premium';
      if (customerId && env.SESSIONS) {
        await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify({ plan, active: true, created: new Date().toISOString() }));
      }
    }

    if (event === 'invoice.paid') {
      const invoice = body.data?.object || {};
      const customerId = invoice.customer;
      if (customerId && env.SESSIONS) {
        const existing = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (existing) { existing.active = true; existing.lastPaid = new Date().toISOString(); await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(existing)); }
      }
    }

    if (event === 'invoice.payment_failed' || event === 'customer.subscription.deleted') {
      const obj = body.data?.object || {};
      const customerId = obj.customer;
      if (customerId && env.SESSIONS) {
        const existing = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (existing) { existing.active = false; await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(existing)); }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}
