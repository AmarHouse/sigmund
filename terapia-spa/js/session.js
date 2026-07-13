const SessionManager = {
  currentId: null,
  sessions: [],

  init() {
    this.sessions = UTILS.storage.get('sessions', []);
    const lastId = UTILS.storage.get('current_session');
    if (lastId && this.sessions.some(s => s.id === lastId)) {
      this.currentId = lastId;
    } else {
      this.create();
    }
  },

  create() {
    const session = {
      id: UTILS.id(),
      title: 'Sessão ' + (this.sessions.length + 1),
      created: UTILS.timestamp(),
      updated: UTILS.timestamp(),
      messages: [],
      metadata: {}
    };
    this.sessions.push(session);
    this.currentId = session.id;
    this.save();
    return session;
  },

  get current() {
    return this.sessions.find(s => s.id === this.currentId);
  },

  switchTo(id) {
    if (this.sessions.some(s => s.id === id)) {
      this.currentId = id;
      UTILS.storage.set('current_session', id);
      return true;
    }
    return false;
  },

  delete(id) {
    const idx = this.sessions.findIndex(s => s.id === id);
    if (idx === -1) return;
    this.sessions.splice(idx, 1);
    if (this.currentId === id) {
      this.currentId = this.sessions.length > 0 ? this.sessions[this.sessions.length - 1].id : null;
      if (!this.currentId) this.create();
    }
    this.save();
  },

  addMessage(role, content, kbContext = []) {
    const session = this.current;
    if (!session) return null;
    const msg = {
      id: UTILS.id(),
      role,
      content,
      timestamp: UTILS.timestamp(),
      kbContext
    };
    session.messages.push(msg);
    session.updated = UTILS.timestamp();
    if (session.messages.length === 1 && role === 'user') {
      session.title = content.slice(0, 60) + (content.length > 60 ? '...' : '');
    }
    this.save();
    return msg;
  },

  updateLastMessage(content, append = false) {
    const session = this.current;
    if (!session || session.messages.length === 0) return;
    const last = session.messages[session.messages.length - 1];
    if (append) last.content += content;
    else last.content = content;
    session.updated = UTILS.timestamp();
    this.save();
  },

  getContextWindow(limit = 20) {
    const session = this.current;
    if (!session) return [];
    return session.messages.slice(-limit).map(m => ({
      role: m.role,
      content: m.content
    }));
  },

  save() {
    UTILS.storage.set('sessions', this.sessions);
    UTILS.storage.set('current_session', this.currentId);
  },

  exportCurrent(format = 'markdown') {
    const session = this.current;
    if (!session || session.messages.length === 0) return null;

    const lines = [
      `# ${session.title}`,
      '',
      `**Data:** ${UTILS.formatDate(session.created)}`,
      `**Duração:** ${this._getDuration(session)}`,
      '',
      '---',
      ''
    ];

    for (const msg of session.messages) {
      const role = msg.role === 'user' ? '👤 Cliente' : '🤖 Terapeuta';
      const time = UTILS.formatTime(msg.timestamp);
      lines.push(`### ${role} (${time})`);
      lines.push('');
      lines.push(msg.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    lines.push('*Sessão gerada pelo SIGMUND — não substitui acompanhamento profissional.*');

    return lines.join('\n');
  },

  _getDuration(session) {
    if (session.messages.length < 2) return '—';
    const start = new Date(session.messages[0].timestamp);
    const end = new Date(session.messages[session.messages.length - 1].timestamp);
    const diff = Math.round((end - start) / 60000);
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}min`;
  },

  getAll() {
    return [...this.sessions].sort((a, b) => new Date(b.updated) - new Date(a.updated));
  }
};
