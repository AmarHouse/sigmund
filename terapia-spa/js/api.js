const SIGMUND_MODEL = 'openrouter/free'; // Always free on OpenRouter
// Para producao: deepseek/deepseek-v4-flash

const API = {
  async fetchModels(provider, apiKey) {
    const endpoints = {
      nvidia: { url: 'https://integrate.api.nvidia.com/v1/models', needsAuth: false },
      openai: { url: 'https://api.openai.com/v1/models', needsAuth: true },
      openrouter: { url: 'https://openrouter.ai/api/v1/models', needsAuth: false },
      anthropic: null,
      google: null,
    };
    const cfg = endpoints[provider];
    if (!cfg) return null;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.needsAuth && apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      const resp = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cfg.url, method: 'GET', headers, body: null }),
      });
      const data = await resp.json();
      if (data.upstreamStatus && data.body) {
        const parsed = JSON.parse(data.body);
        const models = (parsed.data || []).map(m => m.id || m).filter(Boolean);
        return models.length > 0 ? models : null;
      }
      return null;
    } catch { return null; }
  },

  async _request(messages, model, systemPrompt, extra = {}) {
    const body = {
      model: model || SIGMUND_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.95,
    };

    if (systemPrompt) {
      body.messages.unshift({ role: 'system', content: systemPrompt });
    }

    const headers = { 'Content-Type': 'application/json' };
    const isDev = window.location.search.includes('dev=true');

    if (isDev) {
      const apiKey = UTILS.storage.get('api_key', '');
      const provider = UTILS.storage.get('provider', 'openrouter');
      const config = UTILS.Providers[provider];
      if (apiKey && config) {
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['X-Dev-Mode'] = 'true';
        return this._proxyCall(config.baseUrl, body, headers);
      }
    }

    const resp = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {},
        body: JSON.stringify(body),
      }),
    });

    const data = await resp.json();
    if (data.upstreamStatus && data.upstreamStatus >= 400) {
      const err = typeof data.body === 'string' ? data.body.slice(0, 200) : '';
      throw new Error(`Erro ${data.upstreamStatus}: ${err}`);
    }
    if (data.upstreamStatus) {
      try { return JSON.parse(data.body); } catch { return data.body; }
    }
    return data;
  },

  async _proxyCall(url, body, headers) {
    const resp = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, method: 'POST', headers, body: JSON.stringify(body) }),
    });
    const data = await resp.json();
    if (data.upstreamStatus && data.upstreamStatus >= 400) {
      const err = typeof data.body === 'string' ? data.body.slice(0, 200) : '';
      throw new Error(`Erro ${data.upstreamStatus}: ${err}`);
    }
    if (data.upstreamStatus) {
      try { return JSON.parse(data.body); } catch { return data.body; }
    }
    return data;
  },

  async call(messages, kbContext, kbIds, intent, currentNotes, currentSummary, isFirstSession) {
    const systemPrompt = Prompts.getSystemPrompt(intent, kbContext, kbIds, currentNotes, currentSummary, isFirstSession);
    const contextSummary = Prompts.getContextSummary(messages);

    const fullMessages = [
      ...(contextSummary ? [{ role: 'system', content: '## HISTÓRICO RECENTE\n\n' + contextSummary }] : []),
      ...messages.slice(-30).map(m => ({ role: m.role, content: m.content }))
    ];

    const data = await this._request(fullMessages, null, systemPrompt);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }

    throw new Error('Resposta inesperada da API');
  },
};
