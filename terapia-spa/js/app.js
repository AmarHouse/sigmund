(function() {
  'use strict';

  async function init() {
    SessionManager.init();
    await KB.init();

    Chat.init();
    setupUI();

    const session = SessionManager.current;
    if (session && session.messages.length > 0) {
      Chat.loadSession(session.messages);
    }

    updateSessionIndicator();
  }

  function setupUI() {
    setupTheme();
    setupSettings();
    setupEmergency();
    setupHistory();
    setupExport();
    setupNewSession();
  }

  function setupTheme() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const darkToggle = document.getElementById('darkModeToggle');

    const savedTheme = UTILS.storage.get('theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    if (darkToggle) darkToggle.classList.toggle('active', savedTheme === 'dark');

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      UTILS.storage.set('theme', next);
      updateThemeIcon(next);
      if (darkToggle) darkToggle.classList.toggle('active', next === 'dark');
    });

    darkToggle.addEventListener('click', () => {
      const isDark = darkToggle.classList.toggle('active');
      const theme = isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      UTILS.storage.set('theme', theme);
      updateThemeIcon(theme);
    });
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    }
  }

  function setupSettings() {
    const btn = document.getElementById('settingsBtn');
    const modal = document.getElementById('settingsModal');
    const close = document.getElementById('settingsClose');
    const save = document.getElementById('settingsSave');
    const clear = document.getElementById('settingsClear');
    const status = document.getElementById('settingsStatus');

    const providerSelect = document.getElementById('providerSelect');
    const modelSelect = document.getElementById('modelSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');

    const savedProvider = UTILS.storage.get('provider', 'openrouter');
    const savedModel = UTILS.storage.get('model', 'openai/gpt-4o-mini');
    const savedApiKey = UTILS.storage.get('api_key', '');

    providerSelect.value = savedProvider;
    apiKeyInput.value = savedApiKey;
    updateModelOptions(savedProvider, savedModel, savedApiKey);

    providerSelect.addEventListener('change', () => {
      const key = apiKeyInput.value.trim();
      updateModelOptions(providerSelect.value, null, key);
    });

    btn.addEventListener('click', () => {
      modal.classList.remove('modal-hidden');
      status.style.display = 'none';
    });

    close.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    save.addEventListener('click', async () => {
      const provider = providerSelect.value;
      const model = modelSelect.value;
      const apiKey = apiKeyInput.value.trim();

      UTILS.storage.set('provider', provider);
      UTILS.storage.set('model', model);
      if (apiKey) UTILS.storage.set('api_key', apiKey);

      status.style.display = 'block';
      status.className = 'settings-status';
      status.textContent = 'Testando conexão...';

      const result = await API.testConnection();
      if (result.ok) {
        status.className = 'settings-status success';
        status.textContent = 'Conectado com sucesso!';
        showToast('API configurada com sucesso');
        setTimeout(() => closeModal(modal), 1000);
      } else {
        status.className = 'settings-status error';
        status.textContent = result.error || 'Não foi possível conectar. Verifique a chave e o provedor selecionado.';
      }
    });

    clear.addEventListener('click', () => {
      if (confirm('Tem certeza? Todas as configurações e sessões serão apagadas.')) {
        UTILS.storage.clear();
        location.reload();
      }
    });
  }

  async function updateModelOptions(provider, selected, apiKey) {
    const modelSelect = document.getElementById('modelSelect');
    let models = null;

    if (apiKey || provider === 'nvidia') {
      const fetched = await API.fetchModels(provider, apiKey);
      if (fetched) models = fetched;
    }

    if (!models) {
      models = UTILS.getModelsForProvider(provider);
    }

    modelSelect.innerHTML = '';
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      if (selected && m === selected) opt.selected = true;
      modelSelect.appendChild(opt);
    });
  }

  function setupEmergency() {
    const btn = document.getElementById('emergencyBtn');
    const quickBtn = document.getElementById('emergencyQuickBtn');
    const modal = document.getElementById('emergencyModal');
    const close = document.getElementById('emergencyModalClose');

    const show = () => modal.classList.remove('modal-hidden');
    const hide = () => modal.classList.add('modal-hidden');

    btn.addEventListener('click', show);
    quickBtn.addEventListener('click', show);
    close.addEventListener('click', hide);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-hidden').forEach(m => {
          if (!m.classList.contains('modal-hidden')) m.classList.add('modal-hidden');
        });
      }
    });
  }

  function setupHistory() {
    const navBtn = document.querySelector('[data-view="history"]');
    const modal = document.getElementById('historyModal');
    const close = document.getElementById('historyClose');
    const list = document.getElementById('sessionList');

    navBtn.addEventListener('click', () => {
      renderHistoryList();
      modal.classList.remove('modal-hidden');
    });

    close.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    function renderHistoryList() {
      const sessions = SessionManager.getAll();
      if (sessions.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Nenhuma sessão salva</h3><p>Suas sessões aparecerão aqui conforme você conversa.</p></div>';
        return;
      }
      list.innerHTML = '';
      sessions.forEach(s => {
        const item = document.createElement('div');
        item.className = 'session-item';
        const msgCount = s.messages.length;
        const lastTime = UTILS.formatTime(s.updated);
        item.innerHTML = `
          <div class="session-item-info">
            <h3>${UTILS.escapeHtml(s.title)}</h3>
            <p>${msgCount} mensagens • ${lastTime}</p>
          </div>
          <div class="session-item-actions">
            <button class="session-item-btn" data-load="${s.id}" title="Carregar">▶</button>
            <button class="session-item-btn danger" data-delete="${s.id}" title="Excluir">✕</button>
          </div>
        `;
        list.appendChild(item);

        item.querySelector('[data-load]').addEventListener('click', (e) => {
          e.stopPropagation();
          SessionManager.switchTo(s.id);
          Chat.loadSession(s.messages);
          updateSessionIndicator();
          closeModal(modal);
          showToast('Sessão carregada');
        });

        item.querySelector('[data-delete]').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Excluir "${s.title}"?`)) {
            SessionManager.delete(s.id);
            renderHistoryList();
            Chat.loadSession(SessionManager.current?.messages || []);
            updateSessionIndicator();
          }
        });
      });
    }
  }

  function setupExport() {
    const navBtn = document.getElementById('exportNavBtn');

    navBtn.addEventListener('click', () => {
      const session = SessionManager.current;
      if (!session || session.messages.length === 0) {
        showToast('Nenhuma mensagem para exportar');
        return;
      }

      const md = SessionManager.exportCurrent('markdown');
      if (!md) {
        showToast('Nada para exportar');
        return;
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sessao-${session.id.slice(-6)}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Sessão exportada');
    });
  }

  function setupNewSession() {
    const btn = document.getElementById('newSessionBtn');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      SessionManager.create();
      Chat.clear();
      updateSessionIndicator();
      showToast('Nova sessão iniciada');
    });
  }

  function updateSessionIndicator() {
    const el = document.getElementById('sessionIndicator');
    const session = SessionManager.current;
    if (session) {
      el.style.display = 'inline';
      el.textContent = session.title;
    }
  }

  function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function closeModal(el) {
    el.classList.add('modal-hidden');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
