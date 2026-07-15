const SIGMUND_STRIPE = {
  PLANS: {
    premium: { name: 'Premium', price: 4900, sessions: 'dia sim, dia não', priceLabel: 'R$ 49/mês' },
    wl_essential: { name: 'White Label Essential', price: 9700, sessions: 'ilimitado (até 30 pacientes)', priceLabel: 'R$ 97/mês' },
    wl_pro: { name: 'White Label Pro', price: 19700, sessions: 'ilimitado (até 60 pacientes)', priceLabel: 'R$ 197/mês' },
  },

  EXTRA_PRICE: 2000, // R$20 em centavos
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
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;z-index:1000;
      padding:var(--space-4);
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    const modal = document.createElement('div');
    modal.style.cssText = `
      background:var(--color-surface);border-radius:var(--radius-lg);
      padding:var(--space-6);max-width:500px;width:100%;
      box-shadow:0 20px 60px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
      <h2 style="margin:0 0 var(--space-1);font-size:var(--font-size-xl);">Escolha seu plano</h2>
      <p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--space-4);">
        Sua primeira sessão é gratuita. Depois, escolha o plano que faz sentido para você.
      </p>
      <div id="plansList" style="display:flex;flex-direction:column;gap:var(--space-3);">
        <div class="plan-card" data-plan="premium" style="cursor:pointer;padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-md);transition:all var(--transition-fast);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;font-size:var(--font-size-md);">Premium</h3>
              <p style="margin:var(--space-1) 0 0;font-size:var(--font-size-xs);color:var(--color-text-secondary);">Sessões dia sim, dia não · Para uso pessoal</p>
            </div>
            <span style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);color:var(--color-accent);">R$ 49/mês</span>
          </div>
        </div>
        <div class="plan-card" data-plan="wl_essential" style="cursor:pointer;padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-md);transition:all var(--transition-fast);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;font-size:var(--font-size-md);">White Label Essential</h3>
              <p style="margin:var(--space-1) 0 0;font-size:var(--font-size-xs);color:var(--color-text-secondary);">Até 30 pacientes · Marca personalizada · Relatórios</p>
            </div>
            <span style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);color:var(--color-accent);">R$ 97/mês</span>
          </div>
        </div>
        <div class="plan-card" data-plan="wl_pro" style="cursor:pointer;padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-md);transition:all var(--transition-fast);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;font-size:var(--font-size-md);">White Label Pro</h3>
              <p style="margin:var(--space-1) 0 0;font-size:var(--font-size-xs);color:var(--color-text-secondary);">Até 60 pacientes · Prioridade · Suporte completo</p>
            </div>
            <span style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);color:var(--color-accent);">R$ 197/mês</span>
          </div>
        </div>
      </div>
      <button id="closePlansBtn" style="margin-top:var(--space-4);width:100%;padding:var(--space-3);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;color:var(--color-text-secondary);font-size:var(--font-size-sm);">
        Continuar com sessão grátis
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('closePlansBtn').addEventListener('click', () => overlay.remove());

    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', async () => {
        const plan = card.dataset.plan;
        const origin = window.location.origin;
        const result = await SIGMUND_STRIPE.createCheckoutSession(plan, `${origin}/?success=true`, `${origin}/`);
        if (result.url) {
          window.location.href = result.url;
        } else {
          showToast('Erro ao criar sessão de pagamento. Tente novamente.');
        }
      });
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--color-accent)';
        card.style.background = 'var(--color-accent-soft)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'var(--color-border)';
        card.style.background = 'transparent';
      });
    });
  }
};
