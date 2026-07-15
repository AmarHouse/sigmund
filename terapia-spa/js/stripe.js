const SIGMUND_STRIPE = {
  PLANS: {
    premium: {
      name: 'Premium',
      price: 4900,
      priceLabel: 'R$ 49/mês',
      tag: 'Mais escolhido',
      tagline: 'Para o seu autocuidado',
      features: [
        'Sessões dia sim, dia não',
        'Até 50 mensagens por sessão',
        'Modelo de IA de alta qualidade',
        'Export .sgm automático',
        'Proteção por PIN (opcional)',
        'Suporte por email',
      ]
    },
  },

  WL_PLANS: {
    wl_essential: {
      name: 'White Label Essential',
      price: 9700,
      priceLabel: 'R$ 97/mês',
      tagline: 'Para começar',
      features: [
        'Até 30 pacientes ativos',
        'Sessões ilimitadas por paciente',
        'Marca personalizada (logo + cor)',
        'Domínio próprio (seunome.sigmund.app)',
        'Relatórios em PDF',
        'Transcrição por email',
      ]
    },
    wl_pro: {
      name: 'White Label Pro',
      price: 19700,
      priceLabel: 'R$ 197/mês',
      tag: 'Recomendado',
      tagline: 'Para crescer',
      features: [
        'Até 60 pacientes ativos',
        'Sessões ilimitadas por paciente',
        'Marca personalizada (logo + cor)',
        'Domínio próprio',
        'Relatórios em PDF',
        'Transcrição por email',
        'Suporte prioritário',
        'Painel do psicólogo completo',
      ]
    },
  },

  EXTRA_PRICE: 2000,
  EXTRA_LABEL: 'R$ 20',

  async createCheckoutSession(planId, successUrl, cancelUrl) {
    const resp = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, success_url: successUrl, cancel_url: cancelUrl }),
    });
    return resp.json();
  },

  async purchaseExtra(successUrl) {
    const resp = await fetch('/api/purchase-extra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success_url: successUrl }),
    });
    return resp.json();
  },

  showPlans() {
    const existing = document.getElementById('plansOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'plansOverlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;z-index:1000;
      padding:var(--space-4);overflow-y:auto;
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    const modal = document.createElement('div');
    modal.style.cssText = `
      background:var(--color-surface);border-radius:var(--radius-lg);
      padding:var(--space-6);max-width:720px;width:100%;position:relative;
      box-shadow:0 25px 80px rgba(0,0,0,0.3);
    `;

    function renderPlanCard(plan, isWL) {
      const isPopular = plan.tag === 'Mais escolhido' || plan.tag === 'Recomendado';
      return `
        <div class="plan-card premium-card" data-plan="${isWL ? '' : 'premium'}" style="
          cursor:pointer;padding:var(--space-5);border:2px solid ${isPopular ? 'var(--color-accent)' : 'var(--color-border)'};
          border-radius:var(--radius-md);transition:all 0.2s;position:relative;
          background:${isPopular ? 'var(--color-accent-soft)' : 'transparent'};
        ">
          ${plan.tag ? `<div style="
            position:absolute;top:-10px;right:var(--space-4);background:var(--color-accent);
            color:white;font-size:11px;font-weight:600;padding:2px 12px;border-radius:20px;
            letter-spacing:0.3px;
          ">${plan.tag}</div>` : ''}
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4);">
            <div style="flex:1;">
              <h3 style="margin:0 0 2px;font-size:var(--font-size-md);">${plan.name}</h3>
              <p style="margin:0 0 var(--space-2);font-size:var(--font-size-xs);color:var(--color-text-tertiary);">${plan.tagline}</p>
              <ul style="margin:0;padding:0;list-style:none;">
                ${plan.features.map(f => `<li style="font-size:var(--font-size-xs);color:var(--color-text-secondary);padding:2px 0;">✓ ${f}</li>`).join('')}
              </ul>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);color:var(--color-accent);white-space:nowrap;">${plan.priceLabel}</div>
            </div>
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <button id="closePlansBtn" style="
        position:absolute;top:var(--space-4);right:var(--space-4);background:none;border:none;
        font-size:20px;cursor:pointer;color:var(--color-text-tertiary);padding:4px 8px;
        border-radius:var(--radius-sm);
      " onmouseover="this.style.background='var(--color-accent-soft)'" onmouseout="this.style.background='none'">✕</button>

      <div style="margin-bottom:var(--space-5);">
        <h2 style="margin:0;font-size:var(--font-size-lg);">Escolha como quer começar</h2>
        <p style="margin:var(--space-1) 0 0;font-size:var(--font-size-sm);color:var(--color-text-secondary);">
          Sua primeira sessão é gratuita. Depois, escolha o que faz sentido para você.
        </p>
      </div>

      <div style="margin-bottom:var(--space-5);">
        <div style="display:flex;gap:var(--space-1);margin-bottom:var(--space-3);">
          <span style="font-size:var(--font-size-xs);font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--color-text-tertiary);">Para você</span>
        </div>
        <div class="plan-card premium-clicable" data-plan="premium">
          ${renderPlanCard(this.PLANS.premium)}
        </div>
      </div>

      <div style="border-top:1px solid var(--color-border);padding-top:var(--space-4);margin-top:var(--space-4);">
        <div style="display:flex;gap:var(--space-1);margin-bottom:var(--space-3);">
          <span style="font-size:var(--font-size-xs);font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--color-text-tertiary);">Para psicólogos — White Label</span>
        </div>
        <p style="margin:0 0 var(--space-3);font-size:var(--font-size-xs);color:var(--color-text-tertiary);line-height:var(--line-height-relaxed);">
          Sua própria plataforma de terapia com IA. Personalize com sua marca, cadastre seus pacientes e 
          receba relatórios completos de cada sessão.
        </p>
        <div style="display:flex;flex-direction:column;gap:var(--space-3);">
          ${Object.entries(this.WL_PLANS).map(([id, plan]) => `
            <div class="plan-card wl-clicable" data-plan="${id}" style="cursor:pointer;">
              ${renderPlanCard(plan, true)}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:var(--space-4);text-align:center;">
        <button id="freeContinueBtn" style="
          background:none;border:none;cursor:pointer;
          font-size:var(--font-size-sm);color:var(--color-text-tertiary);
          text-decoration:underline;padding:var(--space-2);
        " onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-tertiary)'">
          Continuar usando a sessão gratuita
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('closePlansBtn').addEventListener('click', () => overlay.remove());
    document.getElementById('freeContinueBtn').addEventListener('click', () => overlay.remove());

    document.querySelectorAll('.premium-clicable, .wl-clicable').forEach(card => {
      card.addEventListener('click', async () => {
        const planEl = card.querySelector('.plan-card');
        const plan = planEl?.dataset?.plan || card.dataset.plan;
        if (!plan) return;
        const origin = window.location.origin;
        const result = await SIGMUND_STRIPE.createCheckoutSession(plan, `${origin}/?success=true`, `${origin}/`);
        if (result.url) {
          window.location.href = result.url;
        } else {
          showToast('Erro ao criar sessão de pagamento. Tente novamente.');
        }
      });
    });
  },

  showWLInfo() {
    this.showPlans();
    // Scroll to WL section
    setTimeout(() => {
      const modal = document.querySelector('#plansOverlay > div');
      if (modal) modal.scrollTop = modal.scrollHeight;
    }, 100);
  }
};
