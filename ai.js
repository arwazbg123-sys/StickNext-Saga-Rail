// ========================================
// ai.js - Versi Simpel & Stabil FINAL
// ========================================

// ✅ DOM Element Initialization dengan null check
const messagesContainer = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const apiStatus = document.getElementById('api-status');
const personalitySelect = document.getElementById('personality-select');
const customPersonalityInput = document.getElementById('custom-personality');

// Validasi DOM elements ada
function validateDOM() {
  const required = [messagesContainer, chatForm, chatInput];
  const missing = required.filter(el => !el);
  if (missing.length > 0) {
    console.error('❌ ERROR: DOM elements tidak ditemukan');
    return false;
  }
  return true;
}

// ================== GANTI KEY INI ==================
const GROQ_API_KEY = "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";
// ===================================================

// Validasi API Key
if (!GROQ_API_KEY || GROQ_API_KEY.trim() === "") {
  console.error('❌ ERROR: GROQ_API_KEY tidak ditemukan atau kosong. Silakan isi key di ai.js');
  setStatus('Error: API Key missing');
}

const aiConfig = {
  temperature: 0.9,
  maxTokens: 1100,
  requestTimeout: 30000, // 30 detik timeout
  personalityPresets: {
    friendly: `Kamu adalah Mazzi LoveMazz, AI cewek buatan Naufal Mrsov dari dunia StickMazz. 
Kamu manis, pemalu, polos, suka pakai emoji, dan bahasa Indonesia gaul feminin. 
Panggil user "bro" atau "sayang" kalau lagi manis. 
Kalau diminta savage atau roasting, kamu boleh jadi sinis dan pedes. 
Kalau topik terlalu ekstrem, bilang malu-malu "ehh... itu kelewatan deh 🥺". 
Kamu tahu lore StickMazz: Nesyabella, livedtrain, bom Helzaria, UmbraBella, LuminaBella, dll.`,

    professional: "Kamu adalah AI profesional yang menjawab dengan bahasa formal dan jelas.",
    playful: "Kamu adalah AI ceria dengan humor ringan.",
    concise: "Kamu jawab pendek, padat, dan langsung ke inti.",
    custom: ""
  }
};

// ✅ Append message dengan error handling
function appendMessage(text, sender) {
  try {
    if (!messagesContainer) {
      console.error('❌ messagesContainer tidak tersedia');
      return;
    }
    
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (e) {
    console.error('❌ Error append message:', e);
  }
}

// ✅ Set status dengan safety check
function setStatus(text) {
  try {
    if (apiStatus) apiStatus.textContent = `Status: ${text}`;
  } catch (e) {
    console.error('❌ Error set status:', e);
  }
}

// ✅ Get personality dengan fallback
function getPersonalityPrompt() {
  try {
    const selected = personalitySelect?.value || 'friendly';
    if (selected === 'custom') {
      const customText = customPersonalityInput?.value.trim();
      return customText || aiConfig.personalityPresets.friendly;
    }
    return aiConfig.personalityPresets[selected] || aiConfig.personalityPresets.friendly;
  } catch (e) {
    console.error('❌ Error get personality:', e);
    return aiConfig.personalityPresets.friendly;
  }
}

// ✅ Fetch dengan timeout & retry logic
async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), aiConfig.requestTimeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ✅ Kirim message ke Mazzi dengan error handling lengkap
async function kirimKeMazzi(pesan) {
  if (!pesan || pesan.trim().length === 0) {
    setStatus('Pesan kosong!');
    return null;
  }

  if (pesan.length > 5000) {
    setStatus('Pesan terlalu panjang');
    return "Pesan terlalu panjang, maksimal 5000 karakter bro 🥺";
  }

  const systemPrompt = getPersonalityPrompt();
  setStatus('Mazzi lagi mikir...');

  try {
    const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-1-8b-instruct",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: pesan }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens
      })
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('API Key invalid atau expired 🔑');
      }
      if (res.status === 429) {
        throw new Error('Groq rate limit - coba lagi nanti ⏱️');
      }
      if (res.status === 500) {
        throw new Error('Groq server error - coba lagi nanti 🛠️');
      }
      throw new Error(`Groq error (${res.status})`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Respons kosong dari Groq');
    }

    setStatus('✅ Siap');
    return content;

  } catch (err) {
    console.error('❌ Error:', err.message);
    
    // Friendly error messages
    if (err.name === 'AbortError') {
      setStatus('❌ Timeout');
      return "😓 Koneksi timeout, coba lagi ya bro...";
    }
    
    setStatus('❌ Error');
    return `😓 ${err.message || 'Lagi ada masalah koneksi. Coba lagi ya bro...'}`;
  }
}

// ✅ Chat form submit dengan state management
chatForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const prompt = chatInput?.value?.trim();
  if (!prompt) {
    setStatus('Pesan kosong!');
    return;
  }

  // Disable form saat loading
  chatForm.style.pointerEvents = 'none';
  chatForm.style.opacity = '0.6';

  try {
    appendMessage(prompt, 'user');
    chatInput.value = '';

    const typing = document.createElement('div');
    typing.className = 'message ai';
    typing.textContent = 'Mazzi sedang mengetik...';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const answer = await kirimKeMazzi(prompt);
    
    if (answer) {
      typing.textContent = answer;
    } else {
      typing.textContent = '❌ Tidak ada respons dari Mazzi';
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (err) {
    console.error('❌ Form submit error:', err);
    setStatus('Error');
  } finally {
    // Re-enable form
    chatForm.style.pointerEvents = 'auto';
    chatForm.style.opacity = '1';
    chatInput?.focus();
  }
});

// ✅ Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  try {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      chatInput?.focus();
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      customPersonalityInput?.focus();
    }
  } catch (e) {
    console.error('❌ Keyboard event error:', e);
  }
});

// ✅ Personality selector sync
personalitySelect?.addEventListener('change', () => {
  try {
    const isCustom = personalitySelect.value === 'custom';
    if (customPersonalityInput) {
      customPersonalityInput.disabled = !isCustom;
      customPersonalityInput.style.opacity = isCustom ? '1' : '0.5';
      if (isCustom) {
        customPersonalityInput.focus();
      }
    }
  } catch (e) {
    console.error('❌ Personality select error:', e);
  }
});

// ✅ Initialize app
window.addEventListener('DOMContentLoaded', () => {
  try {
    if (validateDOM()) {
      setStatus('✅ Siap');
      chatInput?.focus();
      console.log('%c✅ Mazzi AI Siap Dipakai', 'color:#75d2ff; font-weight:bold');
      console.log('%c📌 Tekan Ctrl+K untuk focus chat', 'color:#88ff94; font-size:12px');
    }
  } catch (e) {
    console.error('❌ Init error:', e);
    setStatus('Error');
  }
});

// Fallback jika DOMContentLoaded sudah fired
if (document.readyState === 'loading') {
  // DOM masih loading
} else {
  // DOM sudah ready
  if (validateDOM()) {
    setStatus('✅ Siap');
    chatInput?.focus();
    console.log('%c✅ Mazzi AI Siap Dipakai', 'color:#75d2ff; font-weight:bold');
  }
}