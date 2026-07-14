const API = {
  async _request(url, method, headers, body) {
    const resp = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, method, headers, body })
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

  async fetchModels(provider, apiKey) {
    const endpoints = {
      nvidia: { url: 'https://integrate.api.nvidia.com/v1/models', needsAuth: false },
      openai: { url: 'https://api.openai.com/v1/models', needsAuth: true },
      openrouter: { url: 'https://openrouter.ai/api/v1/models', needsAuth: false },
    };
    const cfg = endpoints[provider];
    if (!cfg) return null;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.needsAuth && apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      const data = await this._request(cfg.url, 'GET', headers, null);
      const models = (data.data || []).map(m => m.id || m).filter(Boolean);
      return models.length > 0 ? models : null;
    } catch {
      return null;
    }
  },

  async call(messages, kbContext, kbIds, intent, currentNotes, currentSummary) {
    const provider = UTILS.storage.get('provider', 'openrouter');
    const model = UTILS.storage.get('model', 'openai/gpt-4o-mini');
    const apiKey = UTILS.storage.get('api_key', '');

    if (!apiKey) {
      throw new Error('Chave de API não configurada. Vá em Configurações e adicione sua chave.');
    }

    const systemPrompt = Prompts.getSystemPrompt(intent, kbContext, kbIds, currentNotes, currentSummary);
    const contextSummary = Prompts.getContextSummary(messages);

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...(contextSummary ? [{ role: 'system', content: '## HISTÓRICO RECENTE\n\n' + contextSummary }] : []),
      ...messages.slice(-30).map(m => ({ role: m.role, content: m.content }))
    ];

    switch (provider) {
      case 'anthropic':
        return this._callAnthropic(fullMessages, model, apiKey);
      case 'google':
        return this._callOpenAICompatible(
          `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${apiKey}`,
          fullMessages, model, apiKey, { skipAuth: true }
        );
      default:
        return this._callOpenAICompatible(UTILS.Providers[provider].baseUrl, fullMessages, model, apiKey);
    }
  },

  async _callOpenAICompatible(baseUrl, messages, model, apiKey, opts = {}) {
    const body = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.95
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    if (!opts.skipAuth) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const data = await this._request(baseUrl, 'POST', headers, JSON.stringify(body));

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }

    throw new Error('Resposta inesperada da API');
  },

  async _callAnthropic(messages, model, apiKey) {
    const systemMessages = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const body = {
      model,
      max_tokens: 2048,
      system: systemMessages,
      messages: chatMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    };

    const data = await this._request('https://api.anthropic.com/v1/messages', 'POST', headers, JSON.stringify(body));

    if (data.error) throw new Error(data.error.message || 'Erro da API Anthropic');
    return data.content[0]?.text || '';
  },

  async testConnection() {
    const provider = UTILS.storage.get('provider', 'openrouter');
    const model = UTILS.storage.get('model', 'openai/gpt-4o-mini');
    const apiKey = UTILS.storage.get('api_key', '');

    if (!apiKey) return { ok: false, error: 'Chave de API não informada' };

    try {
      const testMessages = [
        { role: 'system', content: 'Responda apenas com a palavra "OK" se você está funcionando.' },
        { role: 'user', content: 'Teste' }
      ];
      const config = UTILS.Providers[provider];
      if (provider === 'anthropic') {
        await this._callAnthropic(testMessages, model, apiKey);
      } else {
        const url = provider === 'google'
          ? `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${apiKey}`
          : config.baseUrl;
        await this._callOpenAICompatible(url, testMessages, model, apiKey, { skipAuth: provider === 'google' });
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Erro desconhecido' };
    }
  }
};
