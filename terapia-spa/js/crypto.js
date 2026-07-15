const CryptoUtils = {
  async _deriveKey(pin, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  },

  async encrypt(data, pin) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this._deriveKey(pin, salt);
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, enc.encode(data)
    );
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  async decrypt(encoded, pin) {
    try {
      const combined = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const data = combined.slice(28);
      const key = await this._deriveKey(pin, salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv }, key, data
      );
      return new TextDecoder().decode(decrypted);
    } catch {
      return null;
    }
  },

  async hashEmail(email) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(email.trim().toLowerCase()));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  getPin() {
    return UTILS.storage.get('pin', '');
  },

  setPin(pin) {
    UTILS.storage.set('pin', pin);
  },

  hasPin() {
    const pin = this.getPin();
    return pin && pin.length === 4;
  },

  getEmail() {
    return UTILS.storage.get('email', '');
  },

  setEmail(email) {
    UTILS.storage.set('email', email);
  },

  hasEmail() {
    return !!this.getEmail();
  }
};
