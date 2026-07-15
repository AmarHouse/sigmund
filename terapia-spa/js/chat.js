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
        const greeting = 'Olá! Eu sou o SIGMUND, mas pode me chamar de Sig. Que bom que você está aqui. Para começarmos, gostaria de saber como prefere ser chamado(a). Pode me contar um pouco sobre o que te trouxe até aqui?';
        SessionManager.addMessage('assistant', greeting);
        this._addMessage('assistant', greeting);
      });
    }

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }
  },

  _renderWelcome() {
    let el = document.getElementById('welcomeScreen');
    if (el) {
      el.style.display = 'flex';
      return;
    }
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const firstNumber = SessionManager.current?.number || '';
    const hasLastSession = !!UTILS.storage.get('last_session', null) || !!UTILS.storage.get('last_session_encrypted', null);

    const email = CryptoUtils.getEmail();
    const hasAccount = !!email;

    container.insertAdjacentHTML('afterbegin', `
      <div class="chat-welcome" id="welcomeScreen">
        <img class="chat-welcome-icon-img" src="icon.png" alt="SIGMUND">
        <h1>SIGMUND</h1>
        ${firstNumber ? `<p class="welcome-session-label">Sessão ${firstNumber}</p>` : ''}
        <p>Seu espaço de conversa, sem julgamentos. Aqui você pode falar sobre o que estiver sentindo, no seu tempo.</p>
        <div class="welcome-actions">
          <button class="welcome-btn welcome-btn-primary" id="welcomeFirstSession">
            <span class="welcome-btn-icon">&#x1F331;</span>
            <span class="welcome-btn-label">Conversar agora</span>
            <span class="welcome-btn-desc">Primeira sessão gratuita</span>
          </button>
          <button class="welcome-btn" id="welcomeImport">
            <span class="welcome-btn-icon">&#x1F4C2;</span>
            <span class="welcome-btn-label">Importar sessão</span>
            <span class="welcome-btn-desc">Continuar de onde parou</span>
          </button>
          ${hasLastSession ? `
          <button class="welcome-btn" id="welcomeRedownload">
            <span class="welcome-btn-icon">&#x1F4BE;</span>
            <span class="welcome-btn-label">Recuperar última sessão</span>
            <span class="welcome-btn-desc">Baixar .sgm salvo</span>
          </button>` : ''}
        </div>
        ${!hasAccount ? `
        <p style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-top:var(--space-4);">
          Grátis para começar. Depois, <a href="#" id="welcomeSeePlans" style="color:var(--color-accent);text-decoration:underline;">veja os planos</a>.
        </p>` : ''}
      </div>`);

    // Wire plan link
    setTimeout(() => {
      const plansLink = document.getElementById('welcomeSeePlans');
      if (plansLink) {
        plansLink.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPlans();
        });
      }
    }, 0);

    // Add re-download handler
    setTimeout(() => {
      const redl = document.getElementById('welcomeRedownload');
      if (redl) {
        redl.addEventListener('click', async () => {
          let content = null;
          const encrypted = UTILS.storage.get('last_session_encrypted', null);
          const raw = UTILS.storage.get('last_session', null);
          if (encrypted && CryptoUtils.hasPin()) {
            content = await CryptoUtils.decrypt(encrypted, CryptoUtils.getPin());
          } else if (raw) {
            content = raw;
          }
          if (content) {
            const blob = new Blob([content], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = SessionManager.getExportFilename() || 'sessao.sgm';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Última sessão baixada');
          } else {
            showToast('Nenhuma sessão encontrada. Se usava PIN, digite-o nas configurações.');
          }
        });
      }
    }, 0);
    this._setupWelcomeButtons();
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
      const response = await API.call(history, route.kbContext, route.kbIds, route.analysis.intent, currentNotes, currentSummary, isFirstSession);

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
      const msgCount = SessionManager.current?.messages?.length || 0;
      const firstUserIdx = SessionManager.current?.messages?.findIndex(m => m.role === 'user' && !m.imported) || 0;
      const sessionMsgCount = msgCount - firstUserIdx;
      if (sessionMsgCount >= 48 && sessionMsgCount % 2 === 0) {
        this._autoExport();
      }

    } catch (err) {
      this._removeTypingIndicator(msgEl);
      const errorMsg = err.message || 'Ocorreu um erro ao processar sua mensagem.';
      this._addMessage('assistant', `⚠️ **${errorMsg}**\n\nVerifique suas configurações de API e tente novamente.`);
    }

    this.isStreaming = false;
    document.getElementById('sendBtn').disabled = !document.getElementById('chatInput').value.trim();
  },

  _addMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const avatar = document.createElement(role === 'user' ? 'div' : 'img');
    avatar.className = 'message-avatar';
    if (role === 'user') {
      avatar.textContent = '👤';
    } else {
      avatar.src = 'avatar.webp';
      avatar.alt = 'SIGMUND';
    }

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
    div.className = 'message-typing';
    div.id = 'typingIndicator';

    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = 'avatar.webp';
    avatar.alt = 'SIGMUND';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    div.appendChild(avatar);
    div.appendChild(indicator);
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

      // Store in localStorage for re-download (encrypted if PIN is set)
      const storeData = async () => {
        if (CryptoUtils.hasPin()) {
          const encrypted = await CryptoUtils.encrypt(content, CryptoUtils.getPin());
          UTILS.storage.set('last_session_encrypted', encrypted);
          UTILS.storage.set('last_session_has_pin', 'true');
        } else {
          UTILS.storage.set('last_session_raw', content);
          UTILS.storage.remove('last_session_has_pin');
        }
      };
      storeData();
    };

    finishExport(data);

    // Show message in chat
    const lastMsg = document.querySelector('.message:last-child .message-body');
    if (lastMsg) {
      const notice = document.createElement('div');
      notice.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-top:var(--space-2);padding:var(--space-2);background:var(--color-accent-soft);border-radius:var(--radius-md);';
      notice.innerHTML = '📁 Sua sessão foi salva automaticamente. Guarde o arquivo para continuar de onde paramos na próxima vez.';
      lastMsg.appendChild(notice);
    }
  }
};
