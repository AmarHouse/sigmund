const Chat = {
  isStreaming: false,
  abortController: null,

  init() {
    this._renderWelcome();
    this._setupInput();
  },

  _renderWelcome() {
    const el = document.getElementById('welcomeScreen');
    if (el) el.style.display = 'flex';
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

      // SessionManager.updateLastMessage(JSON.stringify(route.kbIds));

      const history = SessionManager.getContextWindow(20);
      const response = await API.call(history, route.kbContext, route.kbIds, route.analysis.intent);

      this._removeTypingIndicator(msgEl);

      const role = 'assistant';
      SessionManager.addMessage(role, response, route.kbIds);
      this._addMessage(role, response);

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

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🧑';

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

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

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
    container.innerHTML = '';
    this._renderWelcome();
  },

  loadSession(messages) {
    this.clear();
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        this._addMessage(msg.role, msg.content);
      }
    }
  }
};
