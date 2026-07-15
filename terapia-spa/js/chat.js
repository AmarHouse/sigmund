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
    let el = document.getElementById('welcomeScreen');
    if (el) { el.style.display = 'flex'; return; }
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const firstNumber = SessionManager.current?.number || '';
    const hasLastSession = !!UTILS.storage.get('last_session', null) || !!UTILS.storage.get('last_session_encrypted', null);
    const email = CryptoUtils.getEmail();
    const hasAccount = !!email;

    container.insertAdjacentHTML('afterbegin', `
      <div class="chat-welcome" id="welcomeScreen">
        <div class="lp-hero">
          <img class="lp-icon" src="icon.png" alt="SIGMUND">
          <h1 class="lp-title">SIGMUND</h1>
          <p class="lp-subtitle">Terapia com IA, disponível 24h</p>
          <p class="lp-description">Um espaço seguro para se ouvir e se entender, sem julgamentos.<br>Converse no seu tempo, no seu ritmo.</p>

          <div class="lp-ctas">
            <button class="welcome-btn welcome-btn-primary" id="welcomeFirstSession">
              <span class="welcome-btn-icon">&#x1F331;</span>
            <span class="welcome-btn-label">Conversar agora</span>
            <span class="welcome-btn-desc">Grátis para começar</span>
            </button>
            <button class="welcome-btn" id="welcomeImport">
              <span class="welcome-btn-icon">&#x1F4C2;</span>
              <span class="welcome-btn-label">Continuar de onde parei</span>
              <span class="welcome-btn-desc">Importar conversa salva</span>
            </button>
            ${hasLastSession ? `
            <button class="welcome-btn" id="welcomeRedownload">
              <span class="welcome-btn-icon">&#x1F4BE;</span>
              <span class="welcome-btn-label">Recuperar última sessão</span>
              <span class="welcome-btn-desc">Baixar .sgm salvo</span>
            </button>` : ''}
          </div>
        </div>

        <div class="lp-benefits">
          <div class="lp-benefit-item">
            <div class="lp-benefit-icon">&#x1F30D;</div>
            <strong>Disponível 24h</strong>
            <span>Quando você precisar, ele está aqui</span>
          </div>
          <div class="lp-benefit-item">
            <div class="lp-benefit-icon">&#x1F512;</div>
            <strong>100% privado</strong>
            <span>Seus dados ficam só no seu navegador</span>
          </div>
          <div class="lp-benefit-item">
            <div class="lp-benefit-icon">&#x1F9EC;</div>
            <strong>Anamnese completa</strong>
            <span>Ele pergunta, entende e lembra</span>
          </div>
          <div class="lp-benefit-item">
            <div class="lp-benefit-icon">&#x1F4AD;</div>
            <strong>Evolui com você</strong>
            <span>Sessões conectadas, não isoladas</span>
          </div>
        </div>

        <div class="lp-section">
          <h2 class="lp-section-title">Como funciona</h2>
          <div class="lp-steps">
            <div class="lp-step">
              <span class="lp-step-num">1</span>
              <strong>Converse</strong>
              <span>Fale sobre o que estiver sentindo</span>
            </div>
            <div class="lp-step">
              <span class="lp-step-num">2</span>
              <strong>Compreenda</strong>
              <span>Ele pergunta para te ajudar a se entender</span>
            </div>
            <div class="lp-step">
              <span class="lp-step-num">3</span>
              <strong>Evolua</strong>
              <span>A cada sessão, retoma de onde parou</span>
            </div>
          </div>
        </div>

        <div class="lp-section">
          <h2 class="lp-section-title">Planos</h2>
          <div class="lp-plans">
            <div class="lp-plan-card" id="welcomePremiumCTA">
              <div class="lp-plan-tag">Mais escolhido</div>
              <h3>Premium</h3>
              <p>Para o seu autocuidado</p>
              <div class="lp-plan-price"><strong>R$ 49</strong><span>/mês</span></div>
              <ul>
                <li>Sessões dia sim, dia não</li>
                <li>Export da conversa automático</li>
                <li>Proteção por PIN</li>
              </ul>
              <button class="welcome-btn welcome-btn-primary" style="width:100%;">Assinar</button>
            </div>
            <div class="lp-plan-card lp-plan-card-wl" id="welcomeWLCTA">
              <h3>White Label</h3>
              <p>Para psicólogos</p>
              <div class="lp-plan-price"><strong>R$ 97</strong><span>/mês</span></div>
              <ul>
                <li>Até 30 pacientes</li>
                <li>Sua marca (logo + domínio)</li>
                <li>Relatórios em PDF</li>
              </ul>
              <button class="welcome-btn" style="width:100%;">Saiba mais</button>
            </div>
          </div>
          ${!hasAccount ? `<p class="lp-free-note">Grátis para começar. <a href="#" id="welcomeSeePlans" style="color:var(--color-accent);text-decoration:underline;">Veja todos os detalhes</a>.</p>` : ''}
        </div>

        <div class="lp-section lp-section-wl" id="welcomeWLSection" style="display:none;">
          <h2 class="lp-section-title">Sua clínica com IA</h2>
          <p>A plataforma que expande seu atendimento com tecnologia que seus pacientes já aceitam.</p>
          <div class="lp-benefits">
            <div class="lp-benefit-item">
              <div class="lp-benefit-icon">&#x1F5E8;</div>
              <strong>Seus pacientes</strong>
              <span>Eles conversam, você recebe relatórios</span>
            </div>
            <div class="lp-benefit-item">
              <div class="lp-benefit-icon">&#x1F4CB;</div>
              <strong>Relatórios automáticos</strong>
              <span>Cada sessão vira um PDF enviado por email</span>
            </div>
            <div class="lp-benefit-item">
              <div class="lp-benefit-icon">&#x1F3F7;</div>
              <strong>Sua marca</strong>
              <span>Logo, cores, domínio próprio</span>
            </div>
          </div>
        </div>

        <div class="lp-footer">
          SIGMUND — terapia com IA &copy; ${new Date().getFullYear()}
        </div>
      </div>`);

    // Event handlers
    setTimeout(() => {
      document.getElementById('welcomeSeePlans')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
      });
      document.getElementById('welcomePremiumCTA')?.addEventListener('click', () => {
        if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showPremiumPlans();
      });
      document.getElementById('welcomeWLCTA')?.addEventListener('click', () => {
        if (typeof SIGMUND_STRIPE !== 'undefined') SIGMUND_STRIPE.showWLPlans();
      });

      const redl = document.getElementById('welcomeRedownload');
      if (redl) {
        redl.addEventListener('click', async () => {
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
    body.style.cssText = 'min-width:160px;display:flex;flex-direction:column;gap:8px;padding:var(--space-4) var(--space-5);';

    // "Pensando" text
    const label = document.createElement('div');
    label.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-tertiary);font-weight:500;margin-bottom:2px;';
    label.textContent = 'Pensando';
    body.appendChild(label);

    // Skeleton bars with better animation
    const lines = [
      { width: '85%', height: '10px' },
      { width: '55%', height: '10px' },
      { width: '70%', height: '10px' },
    ];
    lines.forEach(l => {
      const bar = document.createElement('div');
      bar.className = 'typing-bar';
      bar.style.cssText = `width:${l.width};height:${l.height}px;border-radius:6px;background:var(--color-border);`;
      body.appendChild(bar);
    });

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
      notice.innerHTML = '📁 Sua sessão foi salva automaticamente. Guarde o arquivo para continuar de onde paramos na próxima vez.';
      lastMsg.appendChild(notice);
    }
  }
};
