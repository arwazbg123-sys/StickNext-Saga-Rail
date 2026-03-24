const messagesContainer = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const apiStatus = document.getElementById('api-status');
const apiKeysInput = document.getElementById('api-keys');
const personalitySelect = document.getElementById('personality-select');
const customPersonalityInput = document.getElementById('custom-personality');

const providers = [
  { name: 'Groq', apiKey: '', endpoint: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama3-1-8b-instruct' },
  { name: 'Fireworks', apiKey: 'fw_xxx', endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions', model: 'accounts/fireworks/models/llama-v3p1-8b-instruct' },
  { name: 'Together', apiKey: 'xxx', endpoint: 'https://api.together.xyz/v1/chat/completions', model: 'meta-llama/Llama-3.1-8B-Instruct-Turbo' },
  { name: 'OpenRouter', apiKey: 'sk-or-v1-xxx', endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'meta-llama/llama-3.1-8b-instruct:free' },
  // tambah sisanya sesuai daftar di atas
];

let currentIndex = 0;

const aiConfig = {
  maxRetriesPerProvider: 1,
  personalityPresets: {
    friendly: 'Kamu adalah AI ramah, membantu, dan mendukung pengguna dengan nada positif. Jawab dengan sopan dan berikan contoh langkah jika perlu.',
    professional: 'Kamu adalah AI profesional yang menjawab dengan bahasa formal, jelas, dan tepat. Fokus pada fakta dan ringkasan yang efisien.',
    playful: 'Kamu adalah AI ceria dengan sentuhan humor ringan. Gunakan gaya santai, tetapi tetap memberikan informasi akurat.',
    concise: 'Kamu adalah AI yang sangat ringkas. Berikan jawaban singkat, padat, dan langsung ke inti.',
    custom: '',
  },
};

let activeKeyIndex = 0;
let activeModelIndex = 0;

function appendMessage(text, sender) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;
  messageEl.innerText = text;
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setStatus(text) {
  if (!apiStatus) return;
  apiStatus.innerText = `Status: ${text}`;
}

function getPersonalityPrompt() {
  const selected = personalitySelect?.value || 'friendly';
  if (selected === 'custom') {
    const custom = customPersonalityInput?.value.trim();
    return custom ? custom : aiConfig.personalityPresets.friendly;
  }
  return aiConfig.personalityPresets[selected] || aiConfig.personalityPresets.friendly;
}

function getProviders() {
  const text = apiKeysInput?.value.trim();
  const availableProviders = providers.map(p => ({ ...p }));

  if (!text) {
    return availableProviders;
  }

  const rawKeys = text.split(',').map(k => k.trim()).filter(Boolean);
  if (rawKeys.length === 0) return availableProviders;

  for (let i = 0; i < availableProviders.length; i++) {
    if (rawKeys[i]) {
      availableProviders[i].apiKey = rawKeys[i];
    }
  }

  if (rawKeys.length > availableProviders.length) {
    rawKeys.slice(availableProviders.length).forEach((extraKey, extraIndex) => {
      availableProviders.push({
        name: `Custom${extraIndex + 1}`,
        apiKey: extraKey,
        endpoint: availableProviders[0].endpoint,
        model: availableProviders[0].model,
      });
    });
  }

  return availableProviders;
}

async function kirimKeMazzi(pesan) {
  const systemPrompt = getPersonalityPrompt();
  const providerList = getProviders();
  if (!providerList.length) {
    throw new Error('Tidak ada provider yang dikonfigurasi.');
  }

  for (let i = 0; i < providerList.length; i++) {
    const prov = providerList[(currentIndex + i) % providerList.length];

    try {
      setStatus(`Mencoba ${prov.name}...`);
      const res = await fetch(prov.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${prov.apiKey}`,
          'HTTP-Referer': 'https://arwazbg123-sys.github.io',
          'X-Title': 'StickNext Chat',
        },
        body: JSON.stringify({
          model: prov.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: pesan }
          ],
          temperature: 0.9,
          max_tokens: 1024
        })
      });

      if (!res.ok) {
        console.log(`${prov.name} gagal (${res.status}), coba selanjutnya...`);
        continue;
      }

      const data = await res.json();
      let konten = '';

      if (data.choices?.[0]?.message?.content) {
        konten = data.choices[0].message.content;
      } else if (data.result) {
        konten = data.result;
      } else if (data.output) {
        konten = data.output;
      } else {
        konten = 'Respon tidak ditemukan di payload API.';
      }

      currentIndex = (currentIndex + i) % providerList.length;
      return konten;

    } catch (err) {
      console.error(`${prov.name} error:`, err);
      continue;
    }
  }

  return 'Semua API lagi penuh quota nih sayang... coba lagi nanti ya 🥺';
}

async function requestAI(prompt) {
  setStatus('mengirim pertanyaan...');
  return await kirimKeMazzi(prompt);
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = chatInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, 'user');
  chatInput.value = '';
  setStatus('menunggu respons AI...');

  const typing = document.createElement('div');
  typing.className = 'message ai';
  typing.innerText = 'AI sedang mengetik...';
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const answer = await requestAI(prompt);
    typing.innerText = answer || 'AI tidak memberikan jawaban (response kosong).';
    setStatus('siap');
  } catch (error) {
    console.error('AI request error:', error);
    typing.innerText = `Terjadi kesalahan: ${error.message || 'Unknown error'}`;
    typing.style.background = 'rgba(255, 93, 93, 0.24)';
    setStatus('error');
  }
});

// Integrasi dengan keyboard cepat
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    chatInput.focus();
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    customPersonalityInput.focus();
  }
});

function syncPersonalityUI() {
  if (!personalitySelect || !customPersonalityInput) return;
  if (personalitySelect.value === 'custom') {
    customPersonalityInput.disabled = false;
    customPersonalityInput.style.opacity = '1';
  } else {
    customPersonalityInput.disabled = true;
    customPersonalityInput.style.opacity = '0.55';
  }
}

if (personalitySelect) {
  personalitySelect.addEventListener('change', syncPersonalityUI);
  syncPersonalityUI();
}


