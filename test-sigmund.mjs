import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Intercept /api/proxy requests
page.on('request', req => {
  if (req.url().includes('/api/proxy')) {
    console.log('\n[REQUEST]', req.method(), req.url());
    console.log('  Headers:', JSON.stringify(req.headers()));
    const body = req.postData();
    if (body) console.log('  Body:', body.length > 500 ? body.slice(0, 500) + '...' : body);
  }
});
page.on('response', resp => {
  if (resp.url().includes('/api/proxy')) {
    console.log('[RESPONSE]', resp.status(), resp.statusText());
  }
});

await page.goto('https://sigmund-4fn.pages.dev/', { waitUntil: 'networkidle' });
console.log('Pagina carregada');

// Open settings
await page.waitForSelector('#settingsBtn');
await page.click('#settingsBtn');
await page.waitForSelector('#settingsModal:not(.modal-hidden)');

await page.selectOption('#providerSelect', 'nvidia');
await page.waitForTimeout(300);

const apiKey = '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';
await page.fill('#apiKeyInput', apiKey);
await page.waitForTimeout(2000);

// Wait for models to finish loading
await page.waitForFunction(() => {
  const sel = document.getElementById('modelSelect');
  return sel && sel.options.length > 10;
}, { timeout: 10000 }).catch(() => {});

console.log('\n--- Clicando Save ---');
await page.click('#settingsSave');

await page.waitForSelector('#settingsStatus:not(:empty)', { timeout: 20000 });
await page.waitForTimeout(500);
const statusText = await page.textContent('#settingsStatus');
console.log('Status:', statusText);

await page.waitForTimeout(2000);
await browser.close();
