const SessionManager = {
  currentId: null,
  sessions: [],

  _counter: 0,

  init() {
    this.create();
  },

  create() {
    this._counter++;
    const session = {
      id: UTILS.id(),
      number: this._counter,
      title: 'Sessão ' + this._counter,
      created: UTILS.timestamp(),
      updated: UTILS.timestamp(),
      messages: [],
      metadata: {},
      _isFirstSession: true,
      _notes: '',
      _summary: ''
    };
    this.sessions.push(session);
    this.currentId = session.id;
    return session;
  },

  markFirstSessionDone() {
    const session = this.current;
    if (session) session._isFirstSession = false;
  },

  isFirstSession() {
    const session = this.current;
    return session ? session._isFirstSession : true;
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

  updateSummary(summary) {
    const session = this.current;
    if (!session) return;
    session._summary = summary;
  },

  getSummary() {
    const session = this.current;
    return session ? session._summary : '';
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

  _autoSummary(messages) {
    const lines = [];
    for (const msg of messages.slice(-20)) {
      const prefix = msg.role === 'user' ? 'P' : 'T';
      const text = msg.content.slice(0, 200).replace(/\n/g, ' ');
      lines.push(`${prefix}: ${text}`);
    }
    return lines.join('\n');
  },

  exportCurrent() {
    const session = this.current;
    if (!session || session.messages.length === 0) return null;

    const lines = [
      `# ${session.title}`,
      `- data: ${session.created}`,
      `- duracao: ${this._getDuration(session)}`,
    ];

    const email = CryptoUtils.getEmail();
    if (email) {
      lines.push(`- owner: ${CryptoUtils.hashEmail(email)}`);
    }

    lines.push('', '---', '');

    for (const msg of session.messages) {
      const role = msg.role === 'user' ? 'usuario' : 'terapeuta';
      lines.push(`### ${role}`);
      lines.push('');
      lines.push(msg.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    if (session._summary) {
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('# sumario');
      lines.push('');
      lines.push(session._summary);
    } else if (session.messages.length > 2) {
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('# sumario');
      lines.push('');
      lines.push(this._autoSummary(session.messages));
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
    let summary = '';
    let currentRole = null;
    let currentContent = [];
    let inNotes = false;
    let inSummary = false;
    let fileOwner = null;

    // Check owner hash
    const ownerLine = lines.find(l => l.startsWith('- owner:'));
    if (ownerLine) fileOwner = ownerLine.replace('- owner:', '').trim();
    const email = CryptoUtils.getEmail();
    if (fileOwner && email) {
      if (fileOwner !== CryptoUtils.hashEmail(email)) {
        return { title: '', messages: [], notes: '', summary: '', error: 'Este arquivo pertence a outro usuário. Faça login com a conta correta para importá-lo.' };
      }
    }

    for (const line of lines) {
      if (line.startsWith('# sumario')) {
        inSummary = true;
        inNotes = false;
        continue;
      }
      if (line.startsWith('# notas')) {
        inNotes = true;
        inSummary = false;
        continue;
      }
      if (inSummary) {
        summary += line + '\n';
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

    return { title, messages, notes: notes.trim(), summary: summary.trim() };
  },

  mergeImportedMessages(messages, notes, summary) {
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
    if (summary) session._summary = summary;
    if (notes) session._notes = notes + '\n\n' + session._notes;
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
