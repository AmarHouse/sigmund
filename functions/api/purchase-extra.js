const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  try {
    const { success_url } = await request.json();
    const key = env.STRIPE_SECRET_KEY;
    if (!key) return new Response(JSON.stringify({ error: 'Stripe não configurado' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

    const params = new URLSearchParams({
      mode: 'payment',
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][product_data][name]': 'SIGMUND — Sessão Extra',
      'line_items[0][price_data][unit_amount]': '2000',
      'line_items[0][quantity]': '1',
      'success_url': success_url || 'https://sigmund-4fn.pages.dev/',
      'cancel_url': 'https://sigmund-4fn.pages.dev/',
      'metadata[type]': 'extra_session',
    });

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}
