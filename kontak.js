// Modul kontak.js - Auto-repair contact system tanpa error banner yang mengganggu
const defaultConfig = {
  apiEndpoints: [
    'https://httpbin.org/post',
    'https://jsonplaceholder.typicode.com/posts',
    'https://reqres.in/api/users'
  ],
  timeoutMs: 8000,
  subjectPrefix: '[StickNext Saga Rail]',
  maxRetries: 3,
  retryDelayMs: 1000,
  maxBackoffMs: 5000,
  autoRepairEnabled: true
};

const storageKey = 'stn_contact_messages';
const repairLogKey = 'stn_contact_repair_log';

function query(id) {
  return document.getElementById(id);
}

// Silent logging - tidak mengganggu user
function log(type, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, type, message, data };

  console.log(`[Kontak ${type.toUpperCase()}]`, message, data || '');

  // Simpan log untuk debugging
  try {
    const logs = JSON.parse(localStorage.getItem(repairLogKey) || '[]');
    logs.push(logEntry);
    // Keep only last 50 entries
    if (logs.length > 50) logs.shift();
    localStorage.setItem(repairLogKey, JSON.stringify(logs));
  } catch (e) {
    console.warn('Failed to save repair log:', e);
  }
}

// Visual feedback yang halus - animasi button
function setButtonState(state, message = '') {
  const button = query('form-kontak')?.querySelector('button');
  if (!button) return;

  button.disabled = state === 'loading';

  switch (state) {
    case 'loading':
      button.innerHTML = '⏳ Mengirim...';
      button.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
      log('info', 'Button state: loading');
      break;
    case 'success':
      button.innerHTML = '✅ Terkirim!';
      button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => setButtonState('normal'), 3000);
      log('success', 'Button state: success', message);
      break;
    case 'error':
      button.innerHTML = '❌ Coba Lagi';
      button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      setTimeout(() => setButtonState('normal'), 5000);
      log('error', 'Button state: error', message);
      break;
    default:
      button.innerHTML = 'Kirim';
      button.style.background = '';
      break;
  }
}

function validateEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function validateForm(data) {
  if (!data.nama?.trim() || !data.email?.trim() || !data.pesan?.trim()) {
    log('validation', 'Form validation failed: missing required fields');
    return 'Nama, email, dan pesan harus diisi.';
  }
  if (!validateEmail(data.email)) {
    log('validation', 'Form validation failed: invalid email format');
    return 'Format email tidak valid.';
  }
  return '';
}

// Auto-repair: coba endpoint alternatif
async function tryMultipleEndpoints(payload, attempt = 0) {
  const config = getConfig();
  const endpoints = config.apiEndpoints;

  if (attempt >= endpoints.length) {
    throw new Error('All endpoints failed');
  }

  const endpoint = endpoints[attempt];
  log('repair', `Trying endpoint ${attempt + 1}/${endpoints.length}: ${endpoint}`);

  try {
    const result = await postToEndpoint(endpoint, payload);
    log('repair', `Endpoint ${endpoint} succeeded`);
    return result;
  } catch (error) {
    log('repair', `Endpoint ${endpoint} failed: ${error.message}`);

    // Try next endpoint with exponential backoff
    const delay = Math.min(config.retryDelayMs * Math.pow(2, attempt), config.maxBackoffMs);
    await new Promise(r => setTimeout(r, delay));

    return tryMultipleEndpoints(payload, attempt + 1);
  }
}

async function postToEndpoint(endpoint, payload) {
  const config = getConfig();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const contentType = res.headers.get('Content-Type') || '';
      const body = contentType.includes('application/json') ? await res.json() : await res.text();
      throw new Error(`HTTP ${res.status}: ${JSON.stringify(body)}`);
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function getConfig() {
  if (window.myKontakConfig && typeof window.myKontakConfig === 'object') {
    return {...defaultConfig, ...window.myKontakConfig};
  }
  return defaultConfig;
}

function getStoredMessages() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    log('error', 'Failed to read stored messages', e);
    return [];
  }
}

function setStoredMessages(messages) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  } catch (e) {
    log('error', 'Failed to save stored messages', e);
  }
}

function addStoredMessage(msg) {
  const all = getStoredMessages();
  all.push(msg);
  setStoredMessages(all);
  log('storage', 'Message stored locally', { count: all.length });
}

// Auto-repair: flush stored messages dengan retry agresif
async function flushStoredMessages() {
  if (!getConfig().autoRepairEnabled) return;

  try {
    const stored = getStoredMessages();
    if (!stored.length) return;

    log('repair', `Attempting to flush ${stored.length} stored messages`);

    for (let i = 0; i < stored.length; i++) {
      const item = stored[i];
      try {
        await tryMultipleEndpoints(item.payload);
        stored.splice(i, 1);
        i -= 1;
        log('repair', 'Stored message sent successfully');
      } catch (err) {
        log('repair', 'Stored message still failing, keeping in storage', err.message);
        break; // Stop on first failure to avoid spam
      }
    }
    setStoredMessages(stored);
  } catch (error) {
    log('error', 'Flush stored messages error', error);
  }
}

// Enhanced send with auto-repair
async function sendMessage(event) {
  event.preventDefault();

  const formData = {
    nama: query('nama').value.trim(),
    email: query('email').value.trim(),
    subjek: query('subjek').value.trim(),
    pesan: query('pesan').value.trim()
  };

  // Silent validation - log only
  const validationError = validateForm(formData);
  if (validationError) {
    log('validation', 'Form validation failed', validationError);
    setButtonState('error', validationError);
    return;
  }

  const payload = {
    ...formData,
    subjek: `${getConfig().subjectPrefix} ${formData.subjek || 'Pesan Baru'}`,
    dikirimPada: new Date().toISOString(),
    locale: navigator.language || 'id-ID',
    userAgent: navigator.userAgent,
    origin: window.location.href
  };

  setButtonState('loading');

  try {
    log('send', 'Attempting to send message');
    const result = await tryMultipleEndpoints(payload);

    log('success', 'Message sent successfully', result);
    setButtonState('success', 'Terkirim!');

    // Reset form
    query('form-kontak').reset();

    // Try to flush any stored messages
    setTimeout(() => flushStoredMessages(), 1000);

  } catch (error) {
    log('error', 'All send attempts failed, storing locally', error);

    // Store for later retry
    addStoredMessage({
      timestamp: Date.now(),
      payload,
      error: error.message
    });

    setButtonState('error', 'Disimpan offline - akan dikirim otomatis saat online');
  }
}

function bindEvents() {
  const form = query('form-kontak');
  if (!form) {
    log('error', 'Form not found');
    return;
  }

  form.addEventListener('submit', sendMessage);

  // Auto-repair on network recovery
  window.addEventListener('online', () => {
    log('network', 'Network back online, attempting auto-repair');
    setTimeout(() => flushStoredMessages(), 2000);
  });

  // Periodic auto-repair check (every 30 seconds when online)
  setInterval(() => {
    if (navigator.onLine) {
      flushStoredMessages();
    }
  }, 30000);
}

function init() {
  try {
    log('init', 'Initializing contact system with auto-repair');

    bindEvents();

    // Initial auto-repair attempt
    setTimeout(() => flushStoredMessages(), 2000);

    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    }

  } catch (error) {
    log('error', 'Contact init error', error);
    // Fallback: hide loader
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
