const SessionManager = {
  currentId: null,
  sessions: [],

  _counter: 0,

  init() {
    this._counter = UTILS.storage.get('session_counter', 0);
    this._counter++;
    UTILS.storage.set('session_counter', this._counter);
    this.create();
  },

  create() {
    const session = {
      id: UTILS.id(),
      number: this._counter,
      title: 'Sessão ' + this._counter,
      created: UTILS.timestamp(),
      updated: UTILS.timestamp(),
      messages: [],
      metadata: {},
      _notes: ''
    };
    this.sessions.push(session);
    this.currentId = session.id;
    return session;
  },

  get current() {
    return this.sessions.find(s => s.id === this.currentId);
  },

  switchTo(id) {
    if (this.sessions.some(s => s.id === id)) {
      this.currentId = id;
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
    return msg;
  },

  updateNotes(notes) {
    const session = this.current;
    if (!session) return;
    session._notes = notes;
  },

  getNotes() {
    const session = this.current;
    return session ? session._notes : '';
  },

  getContextWindow(limit = 20) {
    const session = this.current;
    if (!session) return [];
    return session.messages.slice(-limit).map(m => ({
      role: m.role,
      content: m.content
    }));
  },

  getExportFilename() {
    const session = this.current;
    if (!session) return 'sessao.sgm';
    const date = new Date(session.created).toISOString().slice(0, 10);
    return `Sigmund - ${session.title} - ${date}.sgm`;
  },

  exportCurrent() {
    const session = this.current;
    if (!session || session.messages.length === 0) return null;

    const lines = [
      `# ${session.title}`,
      `- data: ${session.created}`,
      `- duracao: ${this._getDuration(session)}`,
      '',
      '---',
      ''
    ];

    for (const msg of session.messages) {
      const role = msg.role === 'user' ? 'usuario' : 'terapeuta';
      lines.push(`### ${role}`);
      lines.push('');
      lines.push(msg.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    if (session._notes) {
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('# notas');
      lines.push('');
      lines.push(session._notes);
    }

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

  importFromMarkdown(text) {
    const lines = text.split('\n');
    const title = lines[0]?.replace(/^#\s*/, '') || 'Sessão importada';
    const messages = [];
    let notes = '';
    let currentRole = null;
    let currentContent = [];
    let inNotes = false;

    for (const line of lines) {
      if (line.startsWith('# notas')) {
        inNotes = true;
        continue;
      }
      if (inNotes) {
        notes += line + '\n';
        continue;
      }

      if (line.startsWith('### usuario') || line.startsWith('### 👤 Cliente') || line.startsWith('### 👤 Usuário')) {
        if (currentRole && currentContent.length) {
          messages.push({ role: currentRole, content: currentContent.join('\n').trim() });
        }
        currentRole = 'user';
        currentContent = [];
      } else if (line.startsWith('### terapeuta') || line.startsWith('### 🧑 Terapeuta') || line.startsWith('### 🤖 Terapeuta')) {
        if (currentRole && currentContent.length) {
          messages.push({ role: currentRole, content: currentContent.join('\n').trim() });
        }
        currentRole = 'assistant';
        currentContent = [];
      } else if (line === '---') {
        continue;
      } else if (currentRole) {
        currentContent.push(line);
      }
    }
    if (currentRole && currentContent.length) {
      messages.push({ role: currentRole, content: currentContent.join('\n').trim() });
    }

    return { title, messages, notes: notes.trim() };
  },

  mergeImportedMessages(messages, notes) {
    const session = this.current;
    if (!session) return;
    const imported = messages.map(m => ({
      id: UTILS.id(),
      role: m.role,
      content: m.content,
      timestamp: UTILS.timestamp(),
      imported: true
    }));
    session.messages = [...imported, ...session.messages];
    session.updated = UTILS.timestamp();
    if (notes) {
      session._notes = notes + '\n\n' + session._notes;
    }
    if (imported.length > 0) {
      const firstUser = imported.find(m => m.role === 'user');
      if (firstUser) {
        session.title = firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? '...' : '');
      }
    }
  },

  hasAnamnesis() {
    const notes = this.getNotes();
    return notes.length > 100;
  }
};
