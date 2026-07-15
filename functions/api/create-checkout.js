const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  try {
    const { plan, success_url, cancel_url } = await request.json();
    const prices = {
      premium: { price: 4900, name: 'SIGMUND Premium' },
      wl_essential: { price: 9700, name: 'SIGMUND White Label Essential' },
      wl_pro: { price: 19700, name: 'SIGMUND White Label Pro' },
    };
    const selected = prices[plan];
    if (!selected) return new Response(JSON.stringify({ error: 'Plano inválido' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

    const key = env.STRIPE_SECRET_KEY;
    if (!key) return new Response(JSON.stringify({ error: 'Stripe não configurado' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

    const params = new URLSearchParams({
      mode: 'subscription',
      locale: 'pt-BR',
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][product_data][name]': selected.name,
      'line_items[0][price_data][recurring][interval]': 'month',
      'line_items[0][price_data][unit_amount]': String(selected.price),
      'line_items[0][quantity]': '1',
      'success_url': success_url || 'https://sigmund-4fn.pages.dev/success',
      'cancel_url': cancel_url || 'https://sigmund-4fn.pages.dev/',
      'metadata[plan]': plan,
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
