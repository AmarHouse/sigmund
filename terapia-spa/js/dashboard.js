const Dashboard = {
  async init() {
    this.render();
    await this.loadPatients();
  },

  render() {
    const main = document.querySelector('.app');
    const existing = document.getElementById('dashboardView');
    if (existing) existing.remove();

    main.insertAdjacentHTML('beforeend', `
      <div id="dashboardView" style="display:none;flex:1;overflow-y:auto;padding:var(--space-5);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-5);">
          <h2 style="margin:0;">Meus Pacientes</h2>
          <div style="display:flex;gap:var(--space-2);">
            <button class="settings-btn secondary" id="addPatientBtn">+ Novo Paciente</button>
            <button class="settings-btn secondary" id="backToChatBtn">← Voltar</button>
          </div>
        </div>
        <div id="patientList" style="display:flex;flex-direction:column;gap:var(--space-3);">
          <p style="color:var(--color-text-tertiary);">Carregando pacientes...</p>
        </div>
      </div>
    `);

    const view = document.getElementById('dashboardView');
    view.style.display = 'flex';
    view.style.flexDirection = 'column';

    document.getElementById('backToChatBtn').addEventListener('click', () => {
      view.style.display = 'none';
      document.getElementById('chatView').style.display = 'flex';
    });

    document.getElementById('addPatientBtn').addEventListener('click', () => this.showAddPatient());
  },

  async loadPatients() {
    const list = document.getElementById('patientList');
    try {
      const resp = await fetch('/api/wl/patients');
      const data = await resp.json();
      if (!data.patients || data.patients.length === 0) {
        list.innerHTML = `
          <div style="text-align:center;padding:var(--space-8);color:var(--color-text-tertiary);">
            <p style="font-size:var(--font-size-lg);margin-bottom:var(--space-2);">Nenhum paciente cadastrado</p>
            <p>Cadastre o primeiro paciente para começar.</p>
          </div>
        `;
        return;
      }
      list.innerHTML = data.patients.map(p => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) var(--space-4);background:var(--color-bg);border-radius:var(--radius-md);border:1px solid var(--color-border);">
          <div>
            <strong>${p.name}</strong>
            <span style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-left:var(--space-2);">${p.sessions || 0} sessões</span>
          </div>
          <div style="display:flex;gap:var(--space-2);">
            <button class="settings-btn secondary" style="font-size:var(--font-size-xs);padding:var(--space-1) var(--space-2);" data-view-patient="${p.id}">Ver</button>
            <button class="settings-btn secondary" style="font-size:var(--font-size-xs);padding:var(--space-1) var(--space-2);" data-email-patient="${p.id}">Enviar relatório</button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('[data-view-patient]').forEach(btn => {
        btn.addEventListener('click', () => this.viewPatient(btn.dataset.viewPatient));
      });
      list.querySelectorAll('[data-email-patient]').forEach(btn => {
        btn.addEventListener('click', () => this.emailReport(btn.dataset.emailPatient));
      });
    } catch {
      list.innerHTML = '<p style="color:var(--color-emergency);">Erro ao carregar pacientes.</p>';
    }
  },

  async showAddPatient() {
    const name = prompt('Nome do paciente:');
    if (!name) return;
    const email = prompt('Email do paciente (opcional):');
    try {
      const resp = await fetch('/api/wl/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await resp.json();
      if (data.ok) {
        showToast('Paciente cadastrado');
        this.loadPatients();
      } else {
        showToast(data.error || 'Erro ao cadastrar');
      }
    } catch {
      showToast('Erro ao cadastrar paciente');
    }
  },

  async viewPatient(patientId) {
    const list = document.getElementById('patientList');
    list.innerHTML = '<p style="color:var(--color-text-tertiary);">Carregando sessões...</p>';
    try {
      const resp = await fetch(`/api/wl/patients/${patientId}/sessions`);
      const data = await resp.json();
      if (!data.sessions || data.sessions.length === 0) {
        list.innerHTML = `
          <button class="settings-btn secondary" style="margin-bottom:var(--space-3);" id="backToPatients">← Voltar</button>
          <p style="text-align:center;color:var(--color-text-tertiary);">Nenhuma sessão registrada para este paciente.</p>
        `;
      } else {
        list.innerHTML = `
          <button class="settings-btn secondary" style="margin-bottom:var(--space-3);" id="backToPatients">← Voltar</button>
          ${data.sessions.map(s => `
            <div style="padding:var(--space-3);background:var(--color-bg);border-radius:var(--radius-md);border:1px solid var(--color-border);margin-bottom:var(--space-2);">
              <div style="display:flex;justify-content:space-between;">
                <strong>${s.title}</strong>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">${s.date}</span>
              </div>
              <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary);margin:var(--space-1) 0;">${s.summary?.slice(0, 200) || 'Sem resumo'}</p>
              <button class="settings-btn secondary" style="font-size:var(--font-size-xs);padding:var(--space-1) var(--space-2);" data-pdf-session="${s.id}">Baixar PDF</button>
            </div>
          `).join('')}
        `;
      }
      document.getElementById('backToPatients').addEventListener('click', () => this.loadPatients());
      list.querySelectorAll('[data-pdf-session]').forEach(btn => {
        btn.addEventListener('click', () => this.downloadPdf(patientId, btn.dataset.pdfSession));
      });
    } catch {
      list.innerHTML = '<p style="color:var(--color-emergency);">Erro ao carregar sessões.</p>';
    }
  },

  async emailReport(patientId) {
    try {
      const resp = await fetch(`/api/wl/patients/${patientId}/email-report`, { method: 'POST' });
      const data = await resp.json();
      if (data.ok) {
        showToast('Relatório enviado por email');
      } else {
        showToast(data.error || 'Erro ao enviar');
      }
    } catch {
      showToast('Erro ao enviar relatório');
    }
  },

  async downloadPdf(patientId, sessionId) {
    try {
      const resp = await fetch(`/api/wl/patients/${patientId}/sessions/${sessionId}/pdf`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sessao-${sessionId.slice(0, 6)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF baixado');
    } catch {
      showToast('Erro ao gerar PDF');
    }
  }
};
