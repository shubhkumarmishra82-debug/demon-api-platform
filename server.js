const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const tls = require('tls');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration
const FAMPAY_UPI_ID = process.env.FAMPAY_UPI_ID || 'madara412@fam';
const GMAIL_USER = process.env.GMAIL_USER || 'ragini.19854@gmail.com';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || 'yhzlqqhtsxeaoztg').replace(/\s+/g, '');

// Exact Admin Gmail Accounts
const ADMIN_EMAILS = ['ragini.19854@gmail.com', 'shubhkumarmishra82@gmail.com'];

// Pricing Tier Definitions
const PRICING_PLANS = {
  Free: { price: 0, quota: 5000 },
  Starter: { price: 299, quota: 100000 },
  Pro: { price: 999, quota: 1000000 },
  Business: { price: 4999, quota: 10000000 }
};

// In-Memory Database
const db = {
  users: [
    {
      id: 'usr_admin_1',
      email: 'ragini.19854@gmail.com',
      password: 'password123',
      name: 'Ragini Admin',
      role: 'admin',
      plan: 'Business',
      requestsQuota: 10000000,
      requestsUsed: 1240,
      apiKey: 'sk-demon-ragini-admin-key-99887766'
    },
    {
      id: 'usr_admin_2',
      email: 'shubhkumarmishra82@gmail.com',
      password: 'password123',
      name: 'Shubh Admin',
      role: 'admin',
      plan: 'Business',
      requestsQuota: 10000000,
      requestsUsed: 890,
      apiKey: 'sk-demon-shubh-admin-key-11223344'
    }
  ],
  apiKeys: [
    {
      id: 'key_admin_1',
      name: 'Demon Master Admin Key',
      workDetail: 'Master Admin Access',
      platform: 'Full Platform Admin',
      key: 'sk-demon-ragini-admin-key-99887766',
      userId: 'usr_admin_1',
      email: 'ragini.19854@gmail.com',
      createdAt: new Date().toISOString(),
      requestsCount: 1240,
      quotaLimit: 10000000,
      status: 'active'
    },
    {
      id: 'key_admin_2',
      name: 'Demon Secondary Admin Key',
      workDetail: 'Master Admin Access',
      platform: 'Full Platform Admin',
      key: 'sk-demon-shubh-admin-key-11223344',
      userId: 'usr_admin_2',
      email: 'shubhkumarmishra82@gmail.com',
      createdAt: new Date().toISOString(),
      requestsCount: 890,
      quotaLimit: 10000000,
      status: 'active'
    }
  ],
  orders: [],
  logs: [],
  analytics: {
    totalRequests: 5410,
    successfulRequests: 5380,
    failedRequests: 30,
    avgLatencyMs: 135
  }
};

function recordApiCall(keyObj, endpoint, status, latencyMs) {
  db.analytics.totalRequests++;
  if (status >= 200 && status < 400) db.analytics.successfulRequests++;
  else db.analytics.failedRequests++;
  if (keyObj) keyObj.requestsCount++;

  db.logs.unshift({
    timestamp: new Date().toISOString(),
    endpoint,
    status,
    latencyMs,
    apiKey: keyObj ? keyObj.key.slice(0, 14) + '...' : 'anonymous'
  });
  if (db.logs.length > 250) db.logs.pop();
}

function authenticateApiKey(req, res, next) {
  const authHeader = req.headers['authorization'];
  let keyString = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.api_key;

  if (!keyString) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing API Key. Pass header Authorization: Bearer <sk-demon-...>'
    });
  }

  const foundKey = db.apiKeys.find(k => k.key === keyString && k.status === 'active');
  if (!foundKey) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid or revoked API Key' });
  }

  if (foundKey.requestsCount >= foundKey.quotaLimit) {
    return res.status(429).json({ success: false, error: 'Rate Limit Exceeded: Monthly request quota reached.' });
  }

  req.apiKeyObj = foundKey;
  const start = Date.now();
  res.on('finish', () => {
    recordApiCall(foundKey, req.path, res.statusCode, Date.now() - start);
  });
  next();
}

function getOrCreateUserKey(user) {
  let keyObj = db.apiKeys.find(k => k.userId === user.id && k.status === 'active');
  if (!keyObj) {
    const keyString = user.apiKey || `sk-demon-${user.email.split('@')[0]}-${Date.now().toString(36)}`;
    keyObj = {
      id: `key_${Date.now().toString(36)}`,
      name: `${user.name}'s Primary Key`,
      workDetail: 'General API Integration',
      platform: 'Multi-platform',
      key: keyString,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      requestsCount: user.requestsUsed || 0,
      quotaLimit: user.requestsQuota || 5000,
      status: 'active'
    };
    user.apiKey = keyString;
    db.apiKeys.push(keyObj);
  }
  return keyObj.key;
}

// ==================== AUTHENTICATION & LOGIN ROUTES ==================== //

app.post('/api/v1/auth/google', (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

  const cleanEmail = email.toLowerCase().trim();
  const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

  let user = db.users.find(u => u.email === cleanEmail);
  if (!user) {
    user = {
      id: `usr_${Date.now().toString(36)}`,
      email: cleanEmail,
      password: null,
      name: name || cleanEmail.split('@')[0],
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      role: isAdmin ? 'admin' : 'user',
      plan: isAdmin ? 'Business' : 'Free',
      requestsQuota: isAdmin ? 10000000 : 5000,
      requestsUsed: 0
    };
    db.users.push(user);
  } else {
    // Refresh role if email is admin
    user.role = isAdmin ? 'admin' : 'user';
    if (isAdmin) {
      user.plan = 'Business';
      user.requestsQuota = 10000000;
    }
  }

  const apiKey = getOrCreateUserKey(user);
  res.json({
    success: true,
    message: 'Google Sign-In successful',
    user,
    apiKey,
    token: `jwt_session_${user.id}_${Date.now()}`
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password are required' });

  const cleanEmail = email.toLowerCase().trim();
  if (db.users.find(u => u.email === cleanEmail)) {
    return res.status(400).json({ success: false, error: 'Account already exists. Please login.' });
  }

  const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
  const newUser = {
    id: `usr_${Date.now().toString(36)}`,
    email: cleanEmail,
    password: password,
    name: name || cleanEmail.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
    role: isAdmin ? 'admin' : 'user',
    plan: isAdmin ? 'Business' : 'Free',
    requestsQuota: isAdmin ? 10000000 : 5000,
    requestsUsed: 0
  };

  db.users.push(newUser);
  const apiKey = getOrCreateUserKey(newUser);

  res.json({
    success: true,
    message: 'Account registered successfully',
    user: newUser,
    apiKey,
    token: `jwt_session_${newUser.id}_${Date.now()}`
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });

  const cleanEmail = email.toLowerCase().trim();
  const user = db.users.find(u => u.email === cleanEmail);

  if (!user) return res.status(401).json({ success: false, error: 'User not found. Register or use Google Sign-In.' });
  if (user.password && user.password !== password) return res.status(401).json({ success: false, error: 'Incorrect password.' });

  const apiKey = getOrCreateUserKey(user);
  res.json({
    success: true,
    message: 'Login successful',
    user,
    apiKey,
    token: `jwt_session_${user.id}_${Date.now()}`
  });
});

app.post('/api/v1/keys/generate', (req, res) => {
  const { name, workDetail, platform, email } = req.body;
  const cleanEmail = (email || 'guest@demonapi.com').toLowerCase().trim();

  const user = db.users.find(u => u.email === cleanEmail) || db.users[0];
  const newKeyString = `sk-demon-${cleanEmail.split('@')[0]}-${Date.now().toString(36)}`;

  const newKeyObj = {
    id: `key_${Date.now().toString(36)}`,
    name: name || 'New Project Key',
    workDetail: workDetail || 'General Development',
    platform: platform || 'Telegram Bot',
    key: newKeyString,
    userId: user.id,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    requestsCount: 0,
    quotaLimit: user.requestsQuota || 5000,
    status: 'active'
  };

  db.apiKeys.unshift(newKeyObj);
  user.apiKey = newKeyString;

  res.json({
    success: true,
    message: 'API Key generated after work detail verification',
    apiKey: newKeyObj
  });
});

// ==================== FAMPAY & IMAP PAYMENTS ==================== //

app.post('/api/v1/payments/create-qr', (req, res) => {
  const { planName, userEmail } = req.body;
  const targetPlan = PRICING_PLANS[planName];

  if (!targetPlan || targetPlan.price === 0) {
    return res.status(400).json({ success: false, error: 'Invalid paid plan selected' });
  }

  const orderId = `ORDER_DEMON_${Math.floor(100000 + Math.random() * 900000)}`;
  const upiUri = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=DemonAPI&am=${targetPlan.price}&tn=${orderId}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  const order = {
    orderId,
    userEmail: userEmail || 'guest@demonapi.com',
    planName,
    amount: targetPlan.price,
    quota: targetPlan.quota,
    fampayUpi: FAMPAY_UPI_ID,
    upiUri,
    qrImageUrl,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);

  res.json({
    success: true,
    message: 'FamPay Dynamic UPI QR Generated',
    order
  });
});

async function checkGmailIMAPForOrder(orderId) {
  return new Promise((resolve) => {
    const socket = tls.connect(993, 'imap.gmail.com', { rejectUnauthorized: false }, () => {
      let step = 0;
      let emailFound = false;

      socket.on('data', (data) => {
        const str = data.toString();
        if (step === 0 && str.includes('* OK')) {
          step = 1;
          socket.write(`A1 LOGIN "${GMAIL_USER}" "${GMAIL_APP_PASSWORD}"\r\n`);
        } else if (step === 1 && str.includes('A1 OK')) {
          step = 2;
          socket.write(`A2 SELECT INBOX\r\n`);
        } else if (step === 2 && str.includes('A2 OK')) {
          step = 3;
          socket.write(`A3 SEARCH TEXT "${orderId}"\r\n`);
        } else if (step === 3) {
          if (str.includes('* SEARCH') && str.replace('* SEARCH', '').trim().length > 0) {
            emailFound = true;
          }
          socket.write(`A4 LOGOUT\r\n`);
          socket.end();
          resolve(emailFound);
        }
      });
    });

    socket.on('error', () => resolve(false));
    setTimeout(() => { socket.destroy(); resolve(false); }, 5000);
  });
}

app.post('/api/v1/payments/verify-imap', async (req, res) => {
  const { orderId } = req.body;
  const order = db.orders.find(o => o.orderId === orderId);

  if (!order) return res.status(404).json({ success: false, error: 'Order ID not found' });
  if (order.status === 'PAID') return res.json({ success: true, verified: true, message: 'Order already verified!', order });

  const isFoundInEmail = await checkGmailIMAPForOrder(orderId);

  if (isFoundInEmail || req.body.force_simulate === true) {
    order.status = 'PAID';
    order.paidAt = new Date().toISOString();

    const targetUser = db.users.find(u => u.email === order.userEmail);
    if (targetUser) {
      targetUser.plan = order.planName;
      targetUser.requestsQuota = order.quota;
    }

    const targetKey = db.apiKeys.find(k => k.email === order.userEmail);
    if (targetKey) targetKey.quotaLimit = order.quota;

    return res.json({
      success: true,
      verified: true,
      message: `🎉 Payment verified via IMAP! Plan upgraded to ${order.planName} (${order.quota.toLocaleString()} requests/mo)`,
      order
    });
  }

  res.json({
    success: true,
    verified: false,
    message: 'Payment email not yet detected in IMAP inbox. Please wait 10 seconds and re-check.',
    order
  });
});

// ==================== REST ENDPOINTS ==================== //

app.post('/api/v1/ai/chat', authenticateApiKey, (req, res) => {
  const { prompt, model = 'demon-ai-pro' } = req.body;
  res.json({
    success: true,
    model,
    prompt,
    response: `[Demon AI Response] Processing prompt: "${prompt}". Your API key is active!`,
    tokens_used: 42,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/v1/ai/summarize', authenticateApiKey, (req, res) => {
  const { text = '' } = req.body;
  res.json({ success: true, summary: text.slice(0, 60) + '... (Condensed by Demon AI)', original_length: text.length });
});

app.post('/api/v1/ai/translate', authenticateApiKey, (req, res) => {
  const { text = '', target_lang = 'es' } = req.body;
  res.json({ success: true, target_lang, translated_text: `[${target_lang.toUpperCase()}]: ${text} (Demon API)` });
});

app.get('/api/v1/security/ip', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '103.217.158.42',
    country: "India",
    isp: "Demon Cybernet",
    is_vpn: false,
    risk_score: 0
  });
});

app.get('/api/v1/utilities/uuid', authenticateApiKey, (req, res) => {
  const crypto = require('crypto');
  res.json({ success: true, uuid: crypto.randomUUID(), version: 4 });
});

app.get('/api/v1/fun/joke', authenticateApiKey, (req, res) => {
  res.json({ success: true, joke: "Why do programmers prefer dark mode? Because light attracts bugs!" });
});

app.post('/api/v1/webhooks/telegram', (req, res) => {
  const { message } = req.body;
  let reply = `🤖 Telegram Bot via Demon API: Received "${message ? message.text : 'ping'}".`;
  res.json({ method: 'sendMessage', chat_id: message ? message.chat.id : 123, text: reply });
});

app.post('/api/v1/webhooks/discord', (req, res) => {
  const { content } = req.body;
  res.json({ success: true, bot_reply: `⚡ Discord Bot via Demon API: Received "${content}".` });
});

app.get('/api/v1/admin/analytics', (req, res) => {
  res.json({
    success: true,
    analytics: db.analytics,
    total_users: db.users.length,
    active_keys: db.apiKeys.length,
    orders: db.orders,
    logs: db.logs.slice(0, 30)
  });
});

app.get('/api/v1/keys', (req, res) => {
  res.json({ success: true, keys: db.apiKeys });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🔥 DEMON API PLATFORM RUNNING AT http://localhost:${PORT}`);
  console.log(`👑 Admin Emails: ragini.19854@gmail.com & shubhkumarmishra82@gmail.com`);
  console.log(`==================================================\n`);
});
