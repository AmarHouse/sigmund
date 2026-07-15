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
      const userId = session.metadata?.user_id || '';
      if (env.SESSIONS) {
        // Store stripe mapping
        if (customerId) {
          await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify({ plan, userId, active: true, created: new Date().toISOString() }));
        }
        // Update user plan in KV
        if (userId) {
          const userData = await env.SESSIONS.get(`user:${userId}`, 'json');
          if (userData) {
            userData.plan = plan;
            userData.stripeCustomerId = customerId;
            await env.SESSIONS.put(`user:${userId}`, JSON.stringify(userData));
          }
        }
      }
    }

    if (event === 'invoice.paid') {
      const invoice = body.data?.object || {};
      const customerId = invoice.customer;
      if (customerId && env.SESSIONS) {
        const stripeData = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (stripeData) {
          stripeData.active = true;
          stripeData.lastPaid = new Date().toISOString();
          await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(stripeData));
          // Also update user plan
          if (stripeData.userId) {
            const userData = await env.SESSIONS.get(`user:${stripeData.userId}`, 'json');
            if (userData) { userData.plan = stripeData.plan; await env.SESSIONS.put(`user:${stripeData.userId}`, JSON.stringify(userData)); }
          }
        }
      }
    }

    if (event === 'invoice.payment_failed' || event === 'customer.subscription.deleted') {
      const obj = body.data?.object || {};
      const customerId = obj.customer;
      if (customerId && env.SESSIONS) {
        const stripeData = await env.SESSIONS.get(`stripe:${customerId}`, 'json');
        if (stripeData) {
          stripeData.active = false;
          await env.SESSIONS.put(`stripe:${customerId}`, JSON.stringify(stripeData));
          if (stripeData.userId) {
            const userData = await env.SESSIONS.get(`user:${stripeData.userId}`, 'json');
            if (userData) { userData.plan = 'free'; await env.SESSIONS.put(`user:${stripeData.userId}`, JSON.stringify(userData)); }
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}
