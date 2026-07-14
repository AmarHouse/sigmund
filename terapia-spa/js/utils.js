const UTILS = {
  storage: {
    get(key, def = null) {
      try {
        const v = localStorage.getItem('terapia_' + key);
        return v ? JSON.parse(v) : def;
      } catch { return def; }
    },
    set(key, value) {
      try { localStorage.setItem('terapia_' + key, JSON.stringify(value)); } catch {}
    },
    remove(key) {
      try { localStorage.removeItem('terapia_' + key); } catch {}
    },
    clear() {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('terapia_'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  },

  id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  timestamp() {
    return new Date().toISOString();
  },

  formatTime(iso) {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return time;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + time;
  },

  formatDate(iso) {
    const d = new Date(iso);
    const days = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
    const day = days[d.getDay()];
    const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${day}, ${date}`;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  highlight(text, query) {
    if (!query) return this.escapeHtml(text);
    const escaped = this.escapeHtml(text);
    const q = this.escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
  },

  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  Providers: {
    openrouter: {
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      models: [
        'openai/gpt-4o', 'openai/gpt-4o-mini', 'openai/o3-mini',
        'anthropic/claude-3.5-sonnet', 'anthropic/claude-3-haiku',
        'google/gemini-2.0-flash-001', 'meta-llama/llama-3.3-70b-instruct',
        'mistralai/mistral-large', 'deepseek/deepseek-chat',
        'cohere/command-r-plus', 'qwen/qwen-2.5-72b-instruct'
      ]
    },
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4.1', 'gpt-4.1-mini']
    },
    anthropic: {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com/v1/messages',
      models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022']
    },
    nvidia: {
      name: 'NVIDIA NIM',
      baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
      models: ['meta/llama-3.1-70b-instruct', 'mistralai/mistral-large', 'nvidia/llama-3.1-nemotron-70b-instruct', 'deepseek-ai/deepseek-v4-flash', 'qwen/qwen-2.5-72b-instruct']
    },
    google: {
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro']
    }
  },

  getModelsForProvider(providerId) {
    return this.Providers[providerId]?.models || this.Providers.openrouter.models;
  },

  getProviderName(providerId) {
    return this.Providers[providerId]?.name || providerId;
  },

  renderMarkdown(text) {
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');
    text = text.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    text = text.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    text = text.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)/g, '<ul>$1</ul>');
    text = text.replace(/<\/ul>\n<ul>/g, '\n');
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)/g, function(m) {
      if (!m.includes('<ol>')) return '<ol>' + m + '</ol>';
      return m;
    });
    text = text.replace(/<\/ol>\n<ol>/g, '\n');
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    text = '<p>' + text + '</p>';
    text = text.replace(/<p><\/p>/g, '');
    text = text.replace(/<br><\/p>/g, '</p>');
    text = text.replace(/<p><br>/g, '<p>');
    text = text.replace(/<ul><br>/g, '<ul>');
    text = text.replace(/<ol><br>/g, '<ol>');
    return text;
  }
};
