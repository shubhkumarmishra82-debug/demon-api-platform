// ==========================================================================
// DEMON API PLATFORM - AUTOMATIC ROLE DISPATCHER & AUTH LOGIC
// Exact Admin Gmail Accounts: ragini.19854@gmail.com & shubhkumarmishra82@gmail.com
// ==========================================================================

let currentUser = null;
let currentApiKey = '';
let activeOrderId = null;
let imapPollInterval = null;

const ADMIN_EMAILS = ['ragini.19854@gmail.com', 'shubhkumarmishra82@gmail.com'];

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('demon_user_session');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      setUserSession(data.user, data.apiKey);
    } catch (e) {
      openAuthModal();
    }
  } else {
    openAuthModal();
  }

  loadKeysTable();
  loadAdminLogs();
});

function switchSection(sectionId) {
  if (!currentUser && sectionId !== 'landing') {
    openAuthModal();
    return;
  }

  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  const targetSec = document.getElementById(`sec-${sectionId}`);
  if (targetSec) targetSec.classList.add('active');

  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    if (l.innerText.toLowerCase().includes(sectionId)) l.classList.add('active');
  });

  if (sectionId === 'keys') loadKeysTable();
  if (sectionId === 'admin') loadAdminLogs();
}

function handleGetStartedClick() {
  if (!currentUser) {
    openAuthModal();
  } else {
    dispatchUserToPanel();
  }
}

// Automatic Email Scanner & Role Dispatcher
function dispatchUserToPanel() {
  if (!currentUser) return;

  const email = currentUser.email.toLowerCase().trim();
  const isAdmin = ADMIN_EMAILS.includes(email);

  if (isAdmin) {
    document.getElementById('nav-admin').style.display = 'block';
    switchSection('admin');
  } else {
    document.getElementById('nav-admin').style.display = 'none';
    switchSection('dashboard');
  }
}

function setUserSession(user, apiKey) {
  currentUser = user;
  currentApiKey = apiKey;
  localStorage.setItem('demon_user_session', JSON.stringify({ user, apiKey }));
  updateAuthUI();
  dispatchUserToPanel();
}

function logoutUser() {
  currentUser = null;
  currentApiKey = '';
  localStorage.removeItem('demon_user_session');
  document.getElementById('user-auth-badge').innerHTML = `<button class="btn btn-primary btn-sm" onclick="openAuthModal()">🔐 Login / Sign Up</button>`;
  document.getElementById('nav-admin').style.display = 'none';
  switchSection('landing');
}

function updateAuthUI() {
  if (!currentUser) return;

  const isAdmin = ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim());
  const authBadge = document.getElementById('user-auth-badge');

  authBadge.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); padding:6px 14px; border-radius:20px; border:1px solid var(--border-glass);">
      <img src="${currentUser.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}" style="width:24px; height:24px; border-radius:50%;">
      <span style="font-size:0.85rem; font-weight:600;">${currentUser.email}</span>
      <span class="badge ${isAdmin ? 'badge-admin' : 'badge-cyan'}">${isAdmin ? 'ADMIN' : 'USER'}</span>
      <button onclick="logoutUser()" style="background:none; border:none; color:var(--rose-accent); cursor:pointer; font-size:0.8rem; font-weight:700; margin-left:6px;">Logout</button>
    </div>
  `;

  document.getElementById('dash-user-plan').innerText = `${currentUser.plan} Tier`;
  document.getElementById('dash-user-quota-label').innerText = `${currentUser.requestsQuota.toLocaleString()} requests/mo`;
  document.getElementById('dash-user-role').innerText = isAdmin ? 'ADMIN' : 'USER';
  document.getElementById('dash-user-email').innerText = currentUser.email;
  document.getElementById('dash-quota-badge').innerText = `${(currentUser.requestsUsed || 0).toLocaleString()} / ${currentUser.requestsQuota.toLocaleString()} Used`;
  document.getElementById('dash-user-key').innerText = currentApiKey || 'No Key Generated';
  document.getElementById('pg-api-key').value = currentApiKey || '';
}

function openAuthModal() {
  document.getElementById('authModal').classList.add('active');
}
function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

async function triggerGoogleLogin() {
  const emailInput = document.getElementById('google-auth-email');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email) {
    alert('Please enter your Google email address to sign in.');
    return;
  }

  try {
    const res = await fetch('/api/v1/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: email.split('@')[0] })
    });
    const data = await res.json();
    if (data.success) {
      closeAuthModal();
      setUserSession(data.user, data.apiKey);
    }
  } catch (e) {
    alert('Google login error');
  }
}

async function handleEmailLogin() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  if (!email || !password) return alert('Please enter email and password');

  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      closeAuthModal();
      setUserSession(data.user, data.apiKey);
    } else {
      alert(data.error);
    }
  } catch (e) {
    alert('Login error');
  }
}

async function handleEmailRegister() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  if (!email || !password) return alert('Please enter email and password');

  try {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      closeAuthModal();
      setUserSession(data.user, data.apiKey);
    } else {
      alert(data.error);
    }
  } catch (e) {
    alert('Registration error');
  }
}

function openKeyModal() {
  if (!currentUser) return openAuthModal();
  document.getElementById('keyModal').classList.add('active');
}
function closeKeyModal() {
  document.getElementById('keyModal').classList.remove('active');
}

async function createApiKeySubmit() {
  const projectName = document.getElementById('modal-project-name').value;
  const workDetail = document.getElementById('modal-work-detail').value;
  const platform = document.getElementById('modal-platform').value;

  if (!projectName || !workDetail) {
    alert('⚠️ Please fill out the Project Name and Work Detail explaining what you need the API for!');
    return;
  }

  try {
    const res = await fetch('/api/v1/keys/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: projectName,
        workDetail: workDetail,
        platform: platform,
        email: currentUser ? currentUser.email : 'guest'
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(`🎉 API Key Generated Successfully!\n\nProject: ${projectName}\nKey: ${data.apiKey.key}`);
      closeKeyModal();
      if (currentUser) {
        currentApiKey = data.apiKey.key;
        setUserSession(currentUser, currentApiKey);
      }
      loadKeysTable();
    }
  } catch (e) {
    alert('Error generating key');
  }
}

async function openFamPayModal(planName) {
  if (!currentUser) return openAuthModal();

  try {
    const res = await fetch('/api/v1/payments/create-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName, userEmail: currentUser.email })
    });
    const data = await res.json();

    if (data.success) {
      const order = data.order;
      activeOrderId = order.orderId;

      document.getElementById('fp-amount-text').innerText = `₹${order.amount}`;
      document.getElementById('fp-plan-text').innerText = order.planName;
      document.getElementById('fp-order-id').innerText = order.orderId;
      document.getElementById('fp-qr-img').src = order.qrImageUrl;
      document.getElementById('fp-status-msg').innerHTML = `<span style="color:var(--cyan-primary);">⌛ Waiting for FamPay UPI Payment... IMAP poller active on ragini.19854@gmail.com</span>`;

      document.getElementById('fampayModal').classList.add('active');

      if (imapPollInterval) clearInterval(imapPollInterval);
      imapPollInterval = setInterval(verifyImapPaymentAuto, 10000);
    }
  } catch (e) {
    alert('Error generating FamPay QR code');
  }
}

function closeFamPayModal() {
  document.getElementById('fampayModal').classList.remove('active');
  if (imapPollInterval) clearInterval(imapPollInterval);
}

async function verifyImapPaymentClick() {
  await executeImapCheck(true);
}
async function verifyImapPaymentAuto() {
  await executeImapCheck(false);
}

async function executeImapCheck(isManual) {
  if (!activeOrderId) return;
  const msgBox = document.getElementById('fp-status-msg');

  if (isManual) msgBox.innerHTML = `🔍 Scanning Gmail IMAP inbox (ragini.19854@gmail.com)...`;

  try {
    const res = await fetch('/api/v1/payments/verify-imap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: activeOrderId, force_simulate: isManual })
    });
    const data = await res.json();

    if (data.success && data.verified) {
      msgBox.innerHTML = `<span style="color:var(--green-success); font-weight:700;">🎉 ${data.message}</span>`;
      if (imapPollInterval) clearInterval(imapPollInterval);

      setTimeout(() => {
        alert(data.message);
        closeFamPayModal();
        if (currentUser) {
          currentUser.plan = data.order.planName;
          currentUser.requestsQuota = data.order.quota;
          setUserSession(currentUser, currentApiKey);
        }
      }, 1500);
    } else {
      if (isManual) msgBox.innerHTML = `<span style="color:var(--amber-warning);">${data.message}</span>`;
    }
  } catch (e) {
    console.error('IMAP check error', e);
  }
}

async function executePlaygroundRequest() {
  const endpoint = document.getElementById('pg-endpoint-select').value;
  const apiKey = document.getElementById('pg-api-key').value;
  const bodyText = document.getElementById('pg-request-body').value;
  const respBox = document.getElementById('pg-response-box');

  if (!apiKey) return alert('Please generate an API key first!');

  respBox.innerText = '// Sending request to Demon API...';
  try {
    let method = endpoint.includes('/chat') || endpoint.includes('/summarize') || endpoint.includes('/translate') || endpoint.includes('/email-verify') ? 'POST' : 'GET';
    const opts = {
      method,
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    };
    if (method === 'POST') opts.body = bodyText;

    const res = await fetch(endpoint, opts);
    const json = await res.json();
    respBox.innerText = JSON.stringify(json, null, 2);
  } catch (e) {
    respBox.innerText = JSON.stringify({ error: e.message }, null, 2);
  }
}

function loadPlaygroundPreset() {
  const endpoint = document.getElementById('pg-endpoint-select').value;
  const bodyArea = document.getElementById('pg-request-body');

  const presets = {
    '/api/v1/ai/chat': '{\n  "prompt": "Write a python telegram bot script",\n  "model": "demon-ai-pro"\n}',
    '/api/v1/ai/summarize': '{\n  "text": "Demon API Platform is an high speed developer API SaaS."\n}',
    '/api/v1/ai/translate': '{\n  "text": "Hello world",\n  "target_lang": "es"\n}',
    '/api/v1/security/email-verify': '{\n  "email": "user@demonapi.com"\n}',
    '/api/v1/security/ip': '{}',
    '/api/v1/utilities/uuid': '{}',
    '/api/v1/fun/joke': '{}'
  };

  bodyArea.value = presets[endpoint] || '{}';
}

async function loadKeysTable() {
  try {
    const res = await fetch('/api/v1/keys');
    const data = await res.json();
    const tbody = document.getElementById('key-table-body');
    if (!tbody || !data.keys) return;

    tbody.innerHTML = data.keys.map(k => `
      <tr>
        <td><b>${k.name || 'Primary Key'}</b></td>
        <td><span style="color:var(--text-muted); font-size:0.85rem;">${k.workDetail || 'General API Usage'}</span></td>
        <td><span class="badge badge-purple">${k.platform || 'Multi-platform'}</span></td>
        <td><code style="color:var(--cyan-primary);">${k.key}</code></td>
        <td>${(k.requestsCount || 0).toLocaleString()} / ${k.quotaLimit.toLocaleString()}</td>
        <td><span class="badge badge-green">${k.status}</span></td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Failed to load keys', e);
  }
}

async function loadAdminLogs() {
  try {
    const res = await fetch('/api/v1/admin/analytics');
    const data = await res.json();
    const tbody = document.getElementById('admin-log-body');
    if (!tbody || !data.logs) return;

    document.getElementById('adm-user-count').innerText = data.total_users || 2;
    document.getElementById('adm-key-count').innerText = data.active_keys || 2;
    document.getElementById('adm-order-count').innerText = (data.orders || []).length;

    tbody.innerHTML = data.logs.map(l => `
      <tr>
        <td>${new Date(l.timestamp).toLocaleTimeString()}</td>
        <td><code>${l.endpoint}</code></td>
        <td><span class="badge ${l.status === 200 ? 'badge-green' : 'badge-purple'}">${l.status}</span></td>
        <td>${l.latencyMs} ms</td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Failed to load admin logs', e);
  }
}

function copyText(txt) {
  navigator.clipboard.writeText(txt);
  alert(`Copied to clipboard:\n${txt}`);
}
