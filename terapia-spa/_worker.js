export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/proxy' && request.method === 'POST') {
      try {
        const { url: target, method, headers, body } = await request.json();
        const resp = await fetch(target, {
          method: method || 'POST',
          headers: { ...headers },
          body: body || undefined,
        });
        const text = await resp.text();
        return new Response(text, {
          status: resp.status,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Serve static files
    return env.ASSETS.fetch(request);
  },
};
