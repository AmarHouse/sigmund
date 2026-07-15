const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  try {
    const { success_url, user_id } = await request.json();
    const key = env.STRIPE_SECRET_KEY;
    if (!key) return new Response(JSON.stringify({ error: 'Stripe não configurado' }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

    const hasPublicKey = !!env.STRIPE_PUBLISHABLE_KEY;
    const params = new URLSearchParams({
      mode: 'payment',
      locale: 'pt-BR',
      ...(hasPublicKey ? { ui_mode: 'embedded', return_url: (success_url || 'https://sigmund-4fn.pages.dev/') + '?payment=complete' } : { success_url: success_url || 'https://sigmund-4fn.pages.dev/', cancel_url: 'https://sigmund-4fn.pages.dev/' }),
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][product_data][name]': 'SIGMUND — Sessão Extra',
      'line_items[0][price_data][product_data][description]': 'Continue sua conversa agora. Uma sessão extra de até 50 mensagens com SIGMUND.',
      'line_items[0][price_data][unit_amount]': '1990',
      'line_items[0][quantity]': '1',
      'metadata[type]': 'extra_session',
      'metadata[user_id]': user_id || '',
    });

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const session = await resp.json();
    return new Response(JSON.stringify({
      client_secret: session.client_secret,
      url: session.url,
      publishable_key: env.STRIPE_PUBLISHABLE_KEY || '',
    }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
  }
}
