(function() {
  'use strict';

  let activeFocusTrap = null;

  function trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    element.addEventListener('keydown', handler);
    activeFocusTrap = () => { element.removeEventListener('keydown', handler); };
  }

  function releaseFocusTrap() {
    if (activeFocusTrap) { activeFocusTrap(); activeFocusTrap = null; }
  }

  function showConfirm(message, confirmLabel, cancelLabel) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'settings-modal-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:300;padding:var(--space-5);animation:fadeIn 0.2s ease;';
      overlay.innerHTML = `
        <div style="background:var(--color-surface);border-radius:var(--radius-xl);max-width:400px;width:100%;padding:var(--space-8);box-shadow:var(--shadow-xl);text-align:center;">
          <div style="font-size:32px;margin-bottom:var(--space-3);">🌱</div>
          <p style="font-size:var(--font-size-base);color:var(--color-text);line-height:var(--line-height-relaxed);margin-bottom:var(--space-6);">${message}</p>
          <div style="display:flex;gap:var(--space-3);">
            <button class="confirm-cancel" style="flex:1;padding:var(--space-3);background:var(--color-bg-soft);border:none;border-radius:var(--radius-md);font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);color:var(--color-text-secondary);cursor:pointer;">${cancelLabel || 'Cancelar'}</button>
            <button class="confirm-ok" style="flex:1;padding:var(--space-3);background:var(--color-accent);border:none;border-radius:var(--radius-md);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:white;cursor:pointer;">${confirmLabel || 'Confirmar'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      trapFocus(overlay);

      overlay.querySelector('.confirm-cancel').addEventListener('click', () => {
        releaseFocusTrap(); overlay.remove(); resolve(false);
      });
      overlay.querySelector('.confirm-ok').addEventListener('click', () => {
        releaseFocusTrap(); overlay.remove(); resolve(true);
      });
      overlay.addEventListener('click', e => {
        if (e.target === overlay) { releaseFocusTrap(); overlay.remove(); resolve(false); }
      });
    });
  }

  async function init() {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Mobile keyboard handling
    if ('visualViewport' in window) {
      const setVh = () => document.documentElement.style.setProperty('--vh', `${visualViewport.height * 0.01}px`);
      visualViewport.addEventListener('resize', setVh);
      setVh();

      // Scroll input into view when keyboard opens
      let lastHeight = visualViewport.height;
      visualViewport.addEventListener('resize', () => {
        const diff = lastHeight - visualViewport.height;
        if (diff > 100) { // keyboard opened
          setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.scrollIntoView({ block: 'end' });
          }, 100);
        }
        lastHeight = visualViewport.height;
      });
    }

    // Swipe to close modals (mobile)
    let touchStartY = 0;
    document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientY - touchStartY;
      if (diff > 150) {
        document.querySelectorAll('.modal-hidden, #plansOverlay, #gsiOverlay, #onboardingOverlay').forEach(el => {
          if (el.style.display !== 'none' && !el.classList.contains('modal-hidden')) {
            el.style.display = 'none';
            el.classList.add('modal-hidden');
          }
        });
      }
    }, { passive: true });

    SessionManager.init();
    await KB.init();

    Chat.init();
    setupUI();

    const session = SessionManager.current;
    if (session && session.messages.length > 0) {
      Chat.loadSession(session.messages);
    }

    updateSessionIndicator();
    updateUserMenu();

    // Auto night mode (22h-6h)
    const hour = new Date().getHours();
    const isDarkHour = hour < 6 || hour >= 22;
    const savedTheme = UTILS.storage.get('theme', '');
    if (savedTheme === '' && isDarkHour) {
      document.documentElement.setAttribute('data-theme', 'dark');
      UTILS.storage.set('theme', 'dark');
    }

    // Show onboarding 60s after session starts (set by chat.js when first message is sent)
    window._startOnboardingTimer = () => {
      setTimeout(() => {
        if (!CryptoUtils.hasEmail()) {
          Onboarding.showAfterFreeSession();
        }
      }, 60000);
    };

    // Check-in between sessions (only on return visit, not right after)
    const lastSession = UTILS.storage.get('last_session', null);
    if (lastSession && !CryptoUtils.hasEmail()) {
      const isReturnVisit = session && session.messages.length === 0;
      if (isReturnVisit) {
        setTimeout(() => {
          Onboarding.showCheckIn();
        }, 3000);
      }
    }
  }

  function setupUI() {
    setupTheme();
    setupSettings();
    setupEmergency();
    setupExport();
    setupImport();
    setupHome();
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
      const savedModel = UTILS.storage.get('model', SIGMUND_MODEL);
      const savedApiKey = UTILS.storage.get('api_key', '');
      providerSelect.value = savedProvider;
      apiKeyInput.value = savedApiKey;

      // Load models on provider change
      const loadModels = async () => {
        const p = providerSelect.value;
        const key = apiKeyInput.value.trim();
        let models = null;
        if (key || p === 'nvidia' || p === 'openrouter') {
          const fetched = await API.fetchModels(p, key);
          if (fetched) models = fetched;
        }
        if (!models) models = UTILS.getModelsForProvider(p);
        modelSelect.innerHTML = '';
        const preferred = UTILS.getModelsForProvider(p);
        let found = false;
        models.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m; opt.textContent = m;
          if (!found && preferred.includes(m)) { opt.selected = true; found = true; }
          modelSelect.appendChild(opt);
        });
      };
      providerSelect.addEventListener('change', loadModels);
      setTimeout(loadModels, 100);

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
      setTimeout(() => trapFocus(modal), 100);
    });

    close.addEventListener('click', () => { releaseFocusTrap(); closeModal(modal); });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) { releaseFocusTrap(); closeModal(modal); }
    });
  }

  function setupEmergency() {
    const quickBtn = document.getElementById('emergencyQuickBtn');
    const modal = document.getElementById('emergencyModal');
    const close = document.getElementById('emergencyModalClose');

    const show = () => {
      modal.classList.remove('modal-hidden');
      setTimeout(() => trapFocus(modal), 100);
    };
    const hide = () => { releaseFocusTrap(); modal.classList.add('modal-hidden'); };

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
      if (CryptoUtils.hasEmail()) {
        fileInput.click();
      } else {
        if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
        showToast('🔒 Retomar conversas disponível no plano Premium');
      }
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
        showToast(`Conversa restaurada com sucesso 💬`);
      } catch (e) {
        if (e instanceof TypeError && e.message === 'Failed to fetch') {
          showToast('Sem conexão com a internet. Verifique sua rede.');
        } else {
          showToast('Não foi possível restaurar a conversa. O arquivo pode estar danificado.');
        }
      }
    });

    // Premium button in header
    const premiumBtn = document.getElementById('headerPremiumBtn');
    if (premiumBtn) {
      premiumBtn.addEventListener('click', () => {
        if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
      });
    }

    // Nav buttons
    document.getElementById('navPremiumBtn')?.addEventListener('click', () => {
      if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
    });
    document.getElementById('navWLBtn')?.addEventListener('click', () => {
      if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showWLPlans();
    });
  }

  function setupExport() {
    const navBtn = document.getElementById('exportNavBtn');

    navBtn.addEventListener('click', () => {
      const session = SessionManager.current;
      if (!session || session.messages.length === 0) {
        showToast('Nenhuma conversa para salvar ainda');
        return;
      }

      const data = SessionManager.exportCurrent();
      if (!data) {
        showToast('Nenhuma conversa para salvar ainda');
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
      showToast('Conversa salva com sucesso 💾');
    });
  }

  function setupHome() {
    const btn = document.getElementById('homeBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        Chat.goHome();
      });
    }
  }

  function setupNewSession() {
    const btns = [document.getElementById('newSessionBtn2')];

    btns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const session = SessionManager.current;
        if (session && session.messages.length > 0) {
          const ok = await showConfirm(
            'Começar uma nova conversa apagará a atual. Se quiser salvá-la, clique em <strong>Salvar</strong> no menu inferior antes.',
            'Nova conversa',
            'Cancelar'
          );
          if (!ok) return;
        }
        SessionManager.create();
        Chat.clear();
        updateSessionIndicator();
        showToast('Nova conversa iniciada 🌱');
      });
    });
  }

  function updateSessionIndicator() {
    const el = document.getElementById('sessionIndicator');
    const progress = document.querySelector('.session-progress-bar');
    const session = SessionManager.current;
    if (session) {
      el.style.display = 'inline';
      el.textContent = session.title;
      if (progress) progress.style.display = 'block';
    }
  }

  function updateUserMenu() {
    const nameEl = document.getElementById('userNameDisplay');
    const planEl = document.getElementById('userPlanBadge');
    const loginBtn = document.getElementById('loginBtn');
    if (!nameEl || !loginBtn) return;

    const email = CryptoUtils.getEmail();
    const name = UTILS.storage.get('user_name', '');
    if (email) {
      loginBtn.style.display = 'none';
      nameEl.style.display = 'inline';
      nameEl.textContent = `👤 ${name || email.split('@')[0]}`;
      if (planEl) {
        const userPlan = UTILS.storage.get('user_plan', 'free');
        if (userPlan !== 'free') {
          planEl.style.display = 'inline';
          planEl.textContent = `⭐ ${userPlan === 'premium' ? 'Premium' : userPlan === 'wl_essential' ? 'Profissional' : 'Pro'}`;
        } else {
          planEl.style.display = 'none';
        }
      }
    } else {
      loginBtn.style.display = 'inline-flex';
      nameEl.style.display = 'none';
      if (planEl) planEl.style.display = 'none';
      loginBtn.addEventListener('click', () => {
        showGoogleSignIn();
      });
    }
  }

  function showGoogleSignIn() {
    const existing = document.getElementById('gsiOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'gsiOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2000;padding:var(--space-4);';
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    const modal = document.createElement('div');
    modal.style.cssText = 'background:var(--color-surface);border-radius:var(--radius-lg);padding:var(--space-6);max-width:380px;width:100%;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,0.3);';

    modal.innerHTML = `
      <button onclick="this.closest('#gsiOverlay').remove()" style="position:absolute;top:var(--space-3);right:var(--space-3);background:none;border:none;font-size:18px;cursor:pointer;color:var(--color-text-tertiary);">✕</button>
      <div style="font-size:40px;margin-bottom:var(--space-3);">&#x1F512;</div>
      <h2 style="margin:0 0 var(--space-1);font-size:var(--font-size-lg);">Crie sua conta</h2>
      <p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--space-5);">Entre com sua conta Google para salvar suas sessões e acessar de qualquer lugar.</p>
      <div id="gsiContainer" style="display:flex;justify-content:center;"></div>
      <p style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-top:var(--space-4);">Ao entrar, você concorda que suas sessões serão vinculadas ao seu email.</p>
    `;
    modal.style.position = 'relative';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Render Google Sign-In button
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleCredential,
      });
      google.accounts.id.renderButton(document.getElementById('gsiContainer'), {
        theme: 'outline', size: 'large', width: 280, text: 'signin_with',
      });
    } else {
      document.getElementById('gsiContainer').innerHTML = '<p style="font-size:var(--font-size-xs);color:var(--color-text-secondary);">Configure o Google Client ID nas variáveis de ambiente para ativar o login.</p>';
    }
  }

  async function handleGoogleCredential(response) {
    try {
      const resp = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential, clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' }),
      });
      const data = await resp.json();
      if (data.ok) {
        CryptoUtils.setEmail(data.user.email);
        UTILS.storage.set('user_name', data.user.name);
        UTILS.storage.set('user_id', data.user.id);
        document.getElementById('gsiOverlay')?.remove();
        // Fetch user session info
        try {
          const sessionResp = await fetch('/api/session?t=' + Date.now(), {
            headers: { 'X-User-Id': data.user.id }
          });
          const sessionData = await sessionResp.json();
          UTILS.storage.set('user_plan', sessionData.plan || 'free');
        } catch {}
        updateUserMenu();
        showToast('✅ Entrou como ' + data.user.name);
      } else {
        showToast('Erro ao entrar: ' + (data.error || 'desconhecido'));
      }
    } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        showToast('Sem conexão com a internet. Verifique sua rede.');
      } else if (e.name === 'SyntaxError') {
        showToast('Erro no servidor. Tente novamente em instantes.');
      } else {
        showToast('Erro de conexão ao autenticar');
      }
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
