const Onboarding = {
  showAfterFreeSession() {
    const hasSeen = UTILS.storage.get('onboarding_seen', false);
    if (hasSeen) return;

    const existing = document.getElementById('onboardingOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'onboardingOverlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;z-index:1000;
      padding:var(--space-4);
    `;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.innerHTML = `
      <div style="background:var(--color-surface);border-radius:var(--radius-lg);padding:var(--space-6);max-width:440px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
        <div style="font-size:48px;margin-bottom:var(--space-3);">&#x1F331;</div>
        <h2 style="margin:0 0 var(--space-2);font-size:var(--font-size-lg);">Gostou da sua primeira sessão?</h2>
        <p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--space-5);line-height:var(--line-height-relaxed);">
          Que bom que você experimentou! Para continuar seu acompanhamento, crie sua conta e escolha um plano.<br><br>
          Sua sessão de hoje já foi salva no arquivo .sgm que você baixou. Com a conta, você pode importá-la e continuar de onde parou.
        </p>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          <button id="onboardingSignup" style="width:100%;padding:var(--space-3);background:var(--color-accent);color:white;border:none;border-radius:var(--radius-md);font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);cursor:pointer;transition:opacity var(--transition-fast);"
            onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            Criar conta — R$ 49/mês
          </button>
          <button id="onboardingLater" style="width:100%;padding:var(--space-3);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);font-size:var(--font-size-sm);color:var(--color-text-secondary);cursor:pointer;">
          Decidir depois
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('onboardingSignup').addEventListener('click', () => {
      overlay.remove();
      if (typeof SIGMUND_STRIPE !== 'undefined') {
        SIGMUND_STRIPE.showPremiumPlans();
      }
      UTILS.storage.set('onboarding_seen', true);
    });

    document.getElementById('onboardingLater').addEventListener('click', () => {
      overlay.remove();
      UTILS.storage.set('onboarding_seen', true);
    });
  },

  showCheckIn() {
    const lastDate = UTILS.storage.get('last_session_date', '');
    if (!lastDate) return;
    const today = new Date().toISOString().slice(0, 10);
    const last = new Date(lastDate);
    const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
    if (diff < 1 || diff > 3) return;

    const existing = document.getElementById('checkinOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'checkinOverlay';
    overlay.style.cssText = `
      position:fixed;bottom:80px;right:var(--space-4);z-index:100;
      background:var(--color-surface);border:1px solid var(--color-border);
      border-radius:var(--radius-lg);padding:var(--space-4);
      max-width:300px;box-shadow:0 8px 30px rgba(0,0,0,0.15);
      animation:slideUp 0.3s ease;
    `;

    overlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <strong style="font-size:var(--font-size-sm);">Como você está hoje?</strong>
          <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary);margin:var(--space-1) 0 0;">Quer compartilhar algo antes da nossa próxima sessão?</p>
        </div>
        <button id="closeCheckin" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--color-text-tertiary);padding:0;line-height:1;">&times;</button>
      </div>
      <button id="checkinYes" style="width:100%;margin-top:var(--space-2);padding:var(--space-2);background:var(--color-accent);color:white;border:none;border-radius:var(--radius-md);font-size:var(--font-size-sm);cursor:pointer;">
        Sim, quero compartilhar
      </button>
    `;

    document.body.appendChild(overlay);

    document.getElementById('closeCheckin').addEventListener('click', () => overlay.remove());
    document.getElementById('checkinYes').addEventListener('click', () => {
      overlay.remove();
      document.getElementById('chatInput')?.focus();
      showToast('Conte como está se sentindo');
    });
  }
};

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `@keyframes slideUp { from { opacity:0;transform:translateY(20px); } to { opacity:1;transform:translateY(0); } }`;
document.head.appendChild(style);
