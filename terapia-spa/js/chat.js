const Chat = {
  isStreaming: false,
  abortController: null,

  init() {
    this._renderWelcome();
    this._setupInput();
    this._setupWelcomeButtons();
  },

  _setupWelcomeButtons() {
    const firstBtn = document.getElementById('welcomeFirstSession');
    const importBtn = document.getElementById('welcomeImport');
    const fileInput = document.getElementById('importFileInput');

    if (firstBtn) {
      firstBtn.addEventListener('click', () => {
        this._hideWelcome();
        const hasAccount = CryptoUtils.hasEmail();
        const greeting = hasAccount
          ? 'Olá! Eu sou o SIGMUND, mas pode me chamar de Sig. Que bom que você está aqui.\n\nSe já tem uma conversa salva, clique em **Continuar** no menu abaixo para importá-la. Se está começando do zero, me conte como prefere ser chamado(a) e o que te trouxe até aqui.'
          : 'Olá! Eu sou o SIGMUND, mas pode me chamar de Sig. Que bom que você está aqui.\n\nPara começarmos, me conte como prefere ser chamado(a) e o que te trouxe até aqui.';
        SessionManager.addMessage('assistant', greeting);
        this._addMessage('assistant', greeting);
        if (!hasAccount && typeof window._startOnboardingTimer === 'function') {
          window._startOnboardingTimer();
        }
      });
    }

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => {
        if (CryptoUtils.hasEmail()) {
          fileInput.click();
        } else {
          if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
          showToast('🔒 Importar conversas disponível no plano Premium');
        }
      });
    }
  },

  _renderWelcome() {
    const el = document.getElementById('welcomeScreen');
    if (el) {
      el.style.display = 'flex';
      this._setupPlanButtons();
      this._setupRedownload();
      return;
    }
  },

  _setupPlanButtons() {
    document.getElementById('welcomePremiumCTA')?.addEventListener('click', () => {
      if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
    });
    document.getElementById('welcomeWLCTA')?.addEventListener('click', () => {
      if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showWLPlans();
    });
  },

  _setupRedownload() {
    const hasLastSession = !!UTILS.storage.get('last_session', null) || !!UTILS.storage.get('last_session_encrypted', null);
    if (!hasLastSession) return;
    const container = document.querySelector('.lp-ctas');
    if (!container || document.getElementById('welcomeRedownload')) return;
    const btn = document.createElement('button');
    btn.className = 'welcome-btn';
    btn.id = 'welcomeRedownload';
    btn.innerHTML = '<span class="welcome-btn-icon">&#x1F4BE;</span><span class="welcome-btn-label">Recuperar conversa</span><span class="welcome-btn-desc">Baixar minha última conversa</span>';
    container.appendChild(btn);
    btn.addEventListener('click', async () => {
      let content = null;
      const encrypted = UTILS.storage.get('last_session_encrypted', null);
      const raw = UTILS.storage.get('last_session', null);
      if (encrypted && CryptoUtils.hasPin()) {
        content = await CryptoUtils.decrypt(encrypted, CryptoUtils.getPin());
      } else if (raw) { content = raw; }
      if (content) {
        const blob = new Blob([content], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = SessionManager.getExportFilename() || 'sessao.sgm';
        a.click(); URL.revokeObjectURL(url);
        showToast('Última conversa baixada 💾');
      } else {
        showToast('Nenhuma conversa encontrada. Se usava senha, digite-a nas Configurações.');
      }
    });
  },

  goHome() {
    const container = document.getElementById('chatMessages');
    container.querySelectorAll('.message, .typing-bar, .message-typing, .typing-indicator').forEach(el => el.remove());
    this._renderWelcome();
    document.getElementById('chatContainer')?.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('sendBtn').disabled = true;
  },

  _hideWelcome() {
    const el = document.getElementById('welcomeScreen');
    if (el) el.style.display = 'none';
  },

  _setupInput() {
    const input = document.getElementById('chatInput');
    const send = document.getElementById('sendBtn');

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      send.disabled = !input.value.trim() || this.isStreaming;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!send.disabled) this.send();
      }
    });

    send.addEventListener('click', () => this.send());
  },

  async send() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || this.isStreaming) return;

    input.value = '';
    input.style.height = 'auto';
    this._hideWelcome();

    const analysis = Router.analyzeInput(text);

    if (analysis.urgency === 'high') {
      document.getElementById('emergencyModal').classList.remove('modal-hidden');
    }

    this._addMessage('user', text);

    SessionManager.addMessage('user', text, Router.lastContext);

    await this._getResponse(text);
  },

  async _getResponse(userText) {
    this.isStreaming = true;
    document.getElementById('sendBtn').disabled = true;

    const msgEl = this._addTypingIndicator();

    try {
      const route = await Router.route(userText);

      const history = SessionManager.getContextWindow(20);
      const currentNotes = SessionManager.getNotes();
      const currentSummary = SessionManager.getSummary();
      const isFirstSession = SessionManager.isFirstSession();

      // Build temporal context
      const now = new Date();
      const timeContext = {
        currentDate: now.toLocaleDateString('pt-BR'),
        currentDay: now.toLocaleDateString('pt-BR', { weekday: 'long' }),
        currentTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      if (!isFirstSession) {
        const allMsgs = SessionManager.current?.messages || [];
        const lastAssistant = [...allMsgs].reverse().find(m => m.role === 'assistant' && !m.imported);
        if (lastAssistant) {
          const lastDate = new Date(lastAssistant.timestamp);
          const diffMs = now - lastDate;
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          timeContext.lastSessionDate = lastDate.toLocaleDateString('pt-BR');
          timeContext.daysSinceLastSession = diffDays;
          if (diffHours < 1) timeContext.gapDescription = 'minutos atrás';
          else if (diffHours === 1) timeContext.gapDescription = '1 hora atrás';
          else if (diffHours < 24) timeContext.gapDescription = `${diffHours} horas atrás`;
          else if (diffDays === 1) timeContext.gapDescription = 'ontem';
          else timeContext.gapDescription = `${diffDays} dias atrás`;
        }
      }

      const response = await API.call(history, route.kbContext, route.kbIds, route.analysis.intent, currentNotes, currentSummary, isFirstSession, timeContext);

      this._removeTypingIndicator(msgEl);

      let cleanResponse = response;
      const commentIndex = response.indexOf('<!--');
      if (commentIndex !== -1) {
        const before = response.slice(0, commentIndex).trim();
        const after = response.slice(commentIndex);
        const summaryMatch = after.match(/<!--\s*summary:\s*([\s\S]*?)-->/i);
        const notesMatch = after.match(/<!--\s*notes:\s*([\s\S]*?)-->/i);
        if (summaryMatch) SessionManager.updateSummary(summaryMatch[1].trim());
        if (notesMatch) SessionManager.updateNotes(notesMatch[1].trim());
        cleanResponse = before;
      }

      const role = 'assistant';
      SessionManager.addMessage(role, cleanResponse, route.kbIds);
      this._addMessage(role, cleanResponse);

      // Auto-export at the end of session
      const allMessages = SessionManager.current?.messages || [];
      const msgCount = allMessages.length;
      const firstUserIdx = allMessages.findIndex(m => m.role === 'user' && !m.imported);
      const sessionMsgCount = firstUserIdx >= 0 ? msgCount - firstUserIdx : msgCount;

      // Update session progress indicator
      this._updateProgress(sessionMsgCount);

      if (sessionMsgCount >= 48 && sessionMsgCount % 2 === 0) {
        this._autoExport();
      }

    } catch (err) {
      this._removeTypingIndicator(msgEl);
      const errorMsg = err.message || '';
      // Upsell from proxy
      if (errorMsg.includes('upsell') || errorMsg.includes('sessão extra')) {
        this._addMessage('assistant', `**Nossa conversa de hoje foi boa.** 😊

Suas 2 sessões da semana já foram. Se quiser continuar agora, posso liberar mais uma por apenas **R\$ 19,90**.

Quer continuar?`);
        // Add extra purchase button
        setTimeout(() => {
          const lastMsg = document.querySelector('.message:last-child .message-body');
          if (lastMsg) {
            const btn = document.createElement('button');
            btn.className = 'welcome-btn welcome-btn-primary';
            btn.style.cssText = 'margin-top:var(--space-3);padding:var(--space-2) var(--space-4);font-size:var(--font-size-sm);';
            btn.innerHTML = '🎟️ Quero uma sessão extra (R$ 19,90)';
            btn.addEventListener('click', () => {
              if (typeof SIGMUND_STRIPE !== 'undefined') {
                SIGMUND_STRIPE.purchaseExtra(window.location.href).then(r => {
                  if (r.url) window.location.href = r.url;
                  else showToast('Erro ao processar pagamento');
                });
              }
            });
            lastMsg.appendChild(btn);
          }
        }, 500);
      } else {
        this._addMessage('assistant', `⚠️ **${errorMsg}**\n\nVerifique suas configurações de API e tente novamente.`);
      }
    }

    this.isStreaming = false;
    document.getElementById('sendBtn').disabled = !document.getElementById('chatInput').value.trim();
  },

  _addMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = role === 'user' ? 'user-avatar.png' : 'avatar.webp';
    avatar.alt = role === 'user' ? 'Você' : 'SIGMUND';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const body = document.createElement('div');
    body.className = 'message-body';

    if (role === 'assistant') {
      body.innerHTML = UTILS.renderMarkdown(content);
    } else {
      body.textContent = content;
    }

    const time = document.createElement('div');
    time.className = 'message-timestamp';
    time.textContent = UTILS.formatTime(UTILS.timestamp());

    contentDiv.appendChild(body);
    contentDiv.appendChild(time);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);

    this._scrollToBottom();
    return msgDiv;
  },

  _addTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.id = 'typingIndicator';
    div.style.animation = 'messageSlideIn 0.3s ease-out';

    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.style.alignSelf = 'flex-start';
    avatar.src = 'avatar.webp';
    avatar.alt = 'SIGMUND';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const body = document.createElement('div');
    body.className = 'message-body';
    body.style.cssText = 'min-width:80px;display:flex;align-items:center;gap:4px;padding:var(--space-4) var(--space-5);';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:var(--color-text-tertiary);animation:typingDot 1.2s ease-in-out ${i * 0.2}s infinite;`;
      body.appendChild(dot);
    }

    contentDiv.appendChild(body);
    div.appendChild(avatar);
    div.appendChild(contentDiv);
    container.appendChild(div);

    this._scrollToBottom();
    return div;
  },

  _removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    else {
      const existing = document.getElementById('typingIndicator');
      if (existing) existing.remove();
    }
  },

  _updateProgress(msgCount) {
    const el = document.getElementById('sessionProgress');
    if (!el) return;
    const pct = Math.min(msgCount / 50 * 100, 100);
    el.style.width = pct + '%';
  },

  _scrollToBottom() {
    const container = document.getElementById('chatContainer');
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  },

  clear() {
    const container = document.getElementById('chatMessages');
    container.querySelectorAll('.message').forEach(el => el.remove());
    this._renderWelcome();
  },

  loadSession(messages) {
    this.clear();
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        this._addMessage(msg.role, msg.content);
      }
    }
  },

  _autoExport() {
    const data = SessionManager.exportCurrent();
    if (!data) return;

    // Try to encrypt with PIN
    const finishExport = (content) => {
      const blob = new Blob([content], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = SessionManager.getExportFilename();
      a.click();
      URL.revokeObjectURL(url);

      // Store in localStorage for re-download
      if (CryptoUtils.hasPin()) {
        CryptoUtils.encrypt(content, CryptoUtils.getPin()).then(encrypted => {
          UTILS.storage.set('last_session_encrypted', encrypted);
          UTILS.storage.set('last_session', content);
        });
      } else {
        UTILS.storage.set('last_session', content);
        UTILS.storage.remove('last_session_encrypted');
      }
    };

    finishExport(data);

    // Show onboarding if user is not logged in
    if (!CryptoUtils.hasEmail()) {
      setTimeout(() => {
        if (typeof Onboarding !== 'undefined') Onboarding.showAfterFreeSession();
      }, 1000);
    }

    // Show message in chat
    const lastMsg = document.querySelector('.message:last-child .message-body');
    if (lastMsg) {
      const notice = document.createElement('div');
      notice.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-top:var(--space-2);padding:var(--space-2);background:var(--color-accent-soft);border-radius:var(--radius-md);';
      notice.innerHTML = '💾 Sua conversa foi salva automaticamente. Guarde este arquivo com carinho — é ele que permite continuarmos de onde paramos na próxima vez.';
      lastMsg.appendChild(notice);
    }
  }
};
