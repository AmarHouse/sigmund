const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }

  try {
    const { url, method, headers, body } = await request.json();

    const resp = await fetch(url, {
      method: method || 'POST',
      headers: { ...headers, 'Accept': 'application/json' },
      body: body || undefined,
    });

    const text = await resp.text();

    if (resp.status >= 400) {
      const isCloudflarePage = text.includes('<!DOCTYPE') || text.includes('Cloudflare') || text.trim() === '404 page not found';
      const cleanBody = isCloudflarePage
        ? JSON.stringify({ error: `O provedor retornou erro ${resp.status}. Verifique se o modelo e a chave API estão corretos.` })
        : text;
      return new Response(JSON.stringify({
        upstreamStatus: resp.status,
        body: cleanBody,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({
      upstreamStatus: resp.status,
      body: text,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      upstreamStatus: 500,
      body: JSON.stringify({ error: e.message }),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}
