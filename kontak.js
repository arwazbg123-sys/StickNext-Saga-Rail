// Modul kontak.js - Pengiriman pesan ke backend/cloud dengan pendekatan modular
const defaultConfig = {
  apiEndpoint: 'https://httpbin.org/post', // Ganti dengan endpoint backend/cloud milik Anda
  timeoutMs: 12000,
  subjectPrefix: '[StickNext Saga Rail]',
  maxRetries: 2,
  retryDelayMs: 800
};

const storageKey = 'stn_pending_messages';

function query(id) {
  return document.getElementById(id);
}

function showStatus(message, type = 'info') {
  const statusBox = query('status-box');
  if (!statusBox) return;
  statusBox.innerText = message;
  statusBox.className = `status-message ${type}`;
}

function validateEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function validateForm(data) {
  if (!data.nama || !data.email || !data.pesan) {
    return 'Nama, email, dan pesan wajib diisi.';
  }
  if (!validateEmail(data.email)) {
    return 'Format email tidak valid.';
  }
  return '';
}

function getConfig() {
  if (window.myKontakConfig && typeof window.myKontakConfig === 'object') {
    return {...defaultConfig, ...window.myKontakConfig};
  }
  return defaultConfig;
}

function getPendingMessages() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca pesan pending:', e);
    return [];
  }
}

function setPendingMessages(messages) {
  localStorage.setItem(storageKey, JSON.stringify(messages));
}

function addPendingMessage(msg) {
  const all = getPendingMessages();
  all.push(msg);
  setPendingMessages(all);
}

async function postContact(payload, attempts = 0) {
  const config = getConfig();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const res = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const contentType = res.headers.get('Content-Type') || '';
      const body = contentType.includes('application/json') ? await res.json() : await res.text();
      throw new Error(`Server error (${res.status}): ${JSON.stringify(body)}`);
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (attempts < config.maxRetries) {
      await new Promise(r => setTimeout(r, config.retryDelayMs));
      return postContact(payload, attempts + 1);
    }
    throw error;
  }
}

async function flushPendingMessages() {
  const pending = getPendingMessages();
  if (!pending.length) return;

  for (let i = 0; i < pending.length; i++) {
    const item = pending[i];
    try {
      await postContact(item.payload);
      pending.splice(i, 1);
      i -= 1;
      showStatus('Pesan pending berhasil terkirim ke server.', 'success');
    } catch (err) {
      showStatus('Pesan pending tetap disimpan karena server tidak tersedia.', 'warning');
      console.warn('Flush pending gagal:', err);
      break;
    }
  }
  setPendingMessages(pending);
}

async function sendMessage(event) {
  event.preventDefault();
  const nama = query('nama').value.trim();
  const email = query('email').value.trim();
  const subjek = query('subjek').value.trim();
  const pesan = query('pesan').value.trim();

  const payload = {
    nama,
    email,
    subjek: `${getConfig().subjectPrefix} ${subjek || 'Pesan Baru'}`,
    pesan,
    dikirimPada: new Date().toISOString(),
    locale: navigator.language || 'id-ID',
    userAgent: navigator.userAgent,
    origin: window.location.href
  };

  const err = validateForm({nama, email, pesan});
  if (err) {
    showStatus(err, 'error');
    return;
  }

  showStatus('Mengirim, tunggu sebentar...', 'info');
  try {
    const hasil = await postContact(payload);
    showStatus('Berhasil dikirim. Tanggapan server: ' + (hasil?.json ? JSON.stringify(hasil.json) : 'OK'), 'success');
    query('form-kontak').reset();
    await flushPendingMessages();
  } catch (error) {
    console.error('Gagal kirim:', error);
    addPendingMessage({timestamp: Date.now(), payload});
    showStatus('Server tidak dapat dijangkau. Pesan disimpan sementara dan akan dicoba lagi bila online.', 'warning');
  }
}

function bindEvents() {
  const form = query('form-kontak');
  if (!form) return;
  form.addEventListener('submit', sendMessage);

  window.addEventListener('online', () => {
    showStatus('Online kembali. Mengirim pesan pending...', 'info');
    flushPendingMessages();
  });
}

function init() {
  const statusArea = document.createElement('div');
  statusArea.id = 'status-box';
  statusArea.className = 'status-message info';
  statusArea.style.marginTop = '1rem';
  statusArea.style.padding = '0.9rem';
  statusArea.style.borderRadius = '7px';
  statusArea.style.border = '1px solid #81afff33';
  statusArea.innerText = 'Silakan isi formulir dan kirim.';

  const formSection = query('form-kontak');
  if (formSection) {
    formSection.appendChild(statusArea);
  }

  bindEvents();
  flushPendingMessages();
}

document.addEventListener('DOMContentLoaded', init);
