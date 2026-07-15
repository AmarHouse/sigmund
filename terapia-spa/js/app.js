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

    // Auto night mode (22h-6h)
    const hour = new Date().getHours();
    const isDarkHour = hour < 6 || hour >= 22;
    const savedTheme = UTILS.storage.get('theme', '');
    if (savedTheme === '' && isDarkHour) {
      document.documentElement.setAttribute('data-theme', 'dark');
      UTILS.storage.set('theme', 'dark');
    }

    // Show onboarding after 1st session (when session has messages and no account)
    setTimeout(() => {
      if (session && session.messages.length >= 3 && !CryptoUtils.hasEmail()) {
        Onboarding.showAfterFreeSession();
      }
    }, 2000);

    // Check-in between sessions
    setTimeout(() => {
      const lastSession = UTILS.storage.get('last_session', null);
      if (lastSession && !CryptoUtils.hasEmail()) {
        Onboarding.showCheckIn();
      }
    }, 3000);
  }

  function setupUI() {
    setupTheme();
    setupSettings();
    setupEmergency();
    setupExport();
    setupImport();
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
    const status = document.getElementById('settingsStatus');
    const isDev = window.location.search.includes('dev=true');

    // BYOK fields - only visible in dev mode
    const devSection = document.getElementById('devSettings');
    const providerSelect = document.getElementById('providerSelect');
    const modelSelect = document.getElementById('modelSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');

    if (devSection) devSection.style.display = isDev ? 'block' : 'none';

    if (isDev) {
      const savedProvider = UTILS.storage.get('provider', 'openrouter');
      const savedModel = UTILS.storage.get('model', 'openai/gpt-4o-mini');
      const savedApiKey = UTILS.storage.get('api_key', '');
      providerSelect.value = savedProvider;
      apiKeyInput.value = savedApiKey;

      const save = document.getElementById('settingsSave');
      if (save) {
        save.addEventListener('click', async () => {
          const provider = providerSelect.value;
          const model = modelSelect.value;
          const apiKey = apiKeyInput.value.trim();
          UTILS.storage.set('provider', provider);
          UTILS.storage.set('model', model);
          if (apiKey) UTILS.storage.set('api_key', apiKey);
          showToast('Configurações de desenvolvimento salvas');
        });
      }
    }

    // PIN setup
    const pinInput = document.getElementById('pinInput');
    const pinSaveBtn = document.getElementById('pinSaveBtn');
    const pinStatus = document.getElementById('pinStatus');

    if (CryptoUtils.hasPin()) {
      pinInput.value = CryptoUtils.getPin();
      pinStatus.textContent = '✅ PIN ativo';
      pinStatus.style.color = 'var(--color-success)';
    }

    pinSaveBtn.addEventListener('click', () => {
      const pin = pinInput.value.trim();
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        pinStatus.textContent = '❌ O PIN deve ter exatamente 4 dígitos';
        pinStatus.style.color = 'var(--color-emergency)';
        return;
      }
      CryptoUtils.setPin(pin);
      pinStatus.textContent = '✅ PIN salvo com sucesso';
      pinStatus.style.color = 'var(--color-success)';
      showToast('PIN salvo');
    });

    // Google OAuth
    const googleSection = document.getElementById('googleAuthSection');
    const loginBtn = document.getElementById('googleLoginBtn');
    const userInfo = document.getElementById('googleUserInfo');
    const userName = document.getElementById('googleUserName');
    const userEmail = document.getElementById('googleUserEmail');

    if (CryptoUtils.hasEmail()) {
      googleSection.style.display = 'block';
      loginBtn.style.display = 'none';
      userInfo.style.display = 'block';
      userName.textContent = UTILS.storage.get('user_name', '');
      userEmail.textContent = CryptoUtils.getEmail();
    } else {
      googleSection.style.display = 'block';
      // OAuth will be integrated when Google Client ID is configured
      loginBtn.addEventListener('click', () => {
        showToast('Login com Google será ativado em breve');
      });
    }

    btn.addEventListener('click', () => {
      modal.classList.remove('modal-hidden');
      if (status) status.style.display = 'none';
    });

    close.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  function setupEmergency() {
    const btn = document.getElementById('emergencyBtn');
    const quickBtn = document.getElementById('emergencyQuickBtn');
    const fabBtn = document.getElementById('emergencyFab');
    const modal = document.getElementById('emergencyModal');
    const close = document.getElementById('emergencyModalClose');

    const show = () => modal.classList.remove('modal-hidden');

    if (fabBtn) fabBtn.addEventListener('click', show);
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

  function setupImport() {
    const btn = document.getElementById('importNavBtn');
    const fileInput = document.getElementById('importFileInput');

    btn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const parsed = SessionManager.importFromMarkdown(text);
        if (parsed.error) {
          showToast(parsed.error);
          fileInput.value = '';
          return;
        }
        if (parsed.messages.length === 0) {
          showToast('Arquivo vazio ou formato inválido');
          return;
        }

        SessionManager.mergeImportedMessages(parsed.messages, parsed.notes, parsed.summary);
        Chat.loadSession(SessionManager.current.messages);
        Chat._hideWelcome();
        fileInput.value = '';
        showToast(`${parsed.messages.length} mensagens importadas`);
      } catch (e) {
        showToast('Erro ao importar: formato inválido');
      }
    });
  }

  function setupExport() {
    const navBtn = document.getElementById('exportNavBtn');

    navBtn.addEventListener('click', () => {
      const session = SessionManager.current;
      if (!session || session.messages.length === 0) {
        showToast('Nenhuma mensagem para exportar');
        return;
      }

      const data = SessionManager.exportCurrent();
      if (!data) {
        showToast('Nada para exportar');
        return;
      }

      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = SessionManager.getExportFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Sessão exportada');
    });
  }

  function setupNewSession() {
    const btns = [document.getElementById('newSessionBtn'), document.getElementById('newSessionBtn2')];

    btns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const session = SessionManager.current;
        if (session && session.messages.length > 0) {
          if (!confirm('Tem certeza? Iniciar uma nova sessão apagará toda a conversa atual.\n\nExporte a sessão antes se quiser preservá-la.')) return;
        }
        SessionManager.create();
        Chat.clear();
        updateSessionIndicator();
        showToast('Nova sessão iniciada');
      });
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
