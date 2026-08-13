<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,10,20,30&height=260&section=header&text=😈%20DEMON%20API%20PLATFORM&fontSize=52&fontColor=ffffff&animation=twinkling&desc=One%20API%20Key.%20Endless%20Possibilities.%20•%2050+%20Developer%20APIs&descSize=20&descAlignColor=06b6d4" width="100%" />

  <br />

  [![GitHub Stars](https://img.shields.io/github/stars/shubhkumarmishra82-debug/demon-api-platform?style=for-the-badge&color=8B5CF6&logo=github)](https://github.com/shubhkumarmishra82-debug/demon-api-platform)
  [![GitHub Forks](https://img.shields.io/github/forks/shubhkumarmishra82-debug/demon-api-platform?style=for-the-badge&color=06B6D4&logo=github)](https://github.com/shubhkumarmishra82-debug/demon-api-platform)
  [![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge?style=for-the-badge&color=10B981&logo=open-source-initiative)](LICENSE)
  [![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
  [![Railway Deployment](https://img.shields.io/badge/Railway-Deploys_Instantly-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](railway.json)
  [![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](server.js)

  <br />
  <br />

  <p align="center">
    <b>🔥 Production-Ready Developer API SaaS Gateway powering Web Apps, AI Agents, Telegram Bots, and Discord Bots.</b>
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-50-api-categories">50+ APIs</a> •
    <a href="#-fampay-imap-payments">FamPay IMAP Engine</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-deployment-guide">Deployment</a>
  </p>

</div>

---

## ⚡ Overview

**Demon API Platform** is a high-speed, enterprise-grade unified API gateway that consolidates **50+ developer tools** across AI, Image Processing, PDF Manipulation, Security, Web Scraping, Financial Payments, and Media Downloaders behind a single API key (`sk-demon-...`).

Designed for high availability, low latency (< 140ms average response time), and zero friction deployment on **Railway**, **Docker VPS**, or **Bare Metal PM2**.

```mermaid
graph TD
    A["🌐 Web App / Telegram Bot / Discord Bot"] -->|Authorization: Bearer sk-demon-...| B["⚡ Demon API Gateway (Express.js)"]
    B --> C{"🔒 API Key & Rate Limit Validator"}
    C -->|Valid Key| D["🚀 50+ Unified API Controllers"]
    C -->|Quota Exceeded| E["❌ 429 Rate Limit Error"]
    D --> F["🧠 AI / 🖼️ Images / 📄 PDFs / 🛡️ Security / 💳 FamPay Payments"]
    F --> G["⚡ High-Speed JSON Response (< 140ms)"]
```

---

## 💎 Key Features

- 🧠 **AI & LLM Suite**: `/chat`, `/embeddings`, `/summarize`, `/translate`, `/paraphrase`, `/speech-to-text`, `/text-to-speech`.
- 🖼️ **Image Processing**: Background removal, 4x upscaling, smart compression, resize, OCR text extraction, format conversion.
- 📄 **PDF Manipulations**: Merge PDFs, split pages, compress file size, extract plain text, image-to-pdf, pdf-to-image.
- 🛡️ **Cyber & IP Security**: Geolocation IP lookup, VPN/Proxy detection, email deliverability verification, password entropy strength analyzer, cryptographic hash generation (MD5/SHA256/SHA512).
- 🌐 **Web Scraper & Metadata**: Website screenshot generator, OpenGraph metadata scraper, favicon fetcher, raw HTML parser, HTTP headers inspector.
- 💳 **FamPay Dynamic UPI QR + IMAP Auto Verification**: Generates dynamic UPI QR codes and uses a background Gmail IMAP engine with Google App Passwords to verify payments automatically.
- 👑 **Automatic Email Scanner & Role Dispatcher**:
  - `ragini.19854@gmail.com` & `shubhkumarmishra82@gmail.com` -> Automatically routed to the **Master Admin Control Center**.
  - All other users -> Automatically routed to their **Personal Developer Panel**.
- 🛠️ **Work Detail API Key Generator**: Mandates users to provide project details (Project Name, Purpose, Target Platform) before key generation.
- 🎮 **Bot Integration Kits & Live Simulators**: Ready-to-run Python & Node.js bots for **Telegram** and **Discord** + live in-browser web simulators!

---

## 🔮 50+ API Categories Matrix

| Category | Endpoint | Method | Description |
| :--- | :--- | :---: | :--- |
| **AI** | `/api/v1/ai/chat` | `POST` | AI Chat Completion Engine |
| **AI** | `/api/v1/ai/embeddings` | `POST` | 1536-Dimensional Vector Embeddings |
| **AI** | `/api/v1/ai/summarize` | `POST` | Text Summarizer |
| **AI** | `/api/v1/ai/translate` | `POST` | Multi-language Translator |
| **Images** | `/api/v1/images/remove-background` | `POST` | Subject Background Removal |
| **Images** | `/api/v1/images/upscale` | `POST` | 4x Resolution Upscaler |
| **Images** | `/api/v1/images/ocr` | `POST` | Optical Character Recognition |
| **PDFs** | `/api/v1/pdf/merge` | `POST` | Combine Multiple PDF Files |
| **PDFs** | `/api/v1/pdf/extract-text` | `POST` | PDF Document Text Extraction |
| **Security** | `/api/v1/security/ip` | `GET` | Client Geolocation & IP Risk Analysis |
| **Security** | `/api/v1/security/email-verify` | `POST` | MX & Deliverability Validator |
| **Utilities**| `/api/v1/utilities/uuid` | `GET` | v4 UUID Generator |
| **Payments** | `/api/v1/payments/create-qr` | `POST` | Dynamic FamPay UPI QR Generator |
| **Payments** | `/api/v1/payments/verify-imap` | `POST` | Automatic IMAP Payment Verification |
| **Fun** | `/api/v1/fun/joke` | `GET` | Programmer & Tech Jokes |

---

## 💳 FamPay IMAP Automated Payment Verification

Demon API Platform features a built-in IMAP engine that automates payment verification without requiring expensive bank gateway approvals:

```
[User Selects Plan (₹299/₹999/₹4999)]
         │
         ▼
[Server Generates Dynamic UPI QR with ORDER_DEMON_XXXXXX]
         │
         ▼
[User Pays via FamPay / PhonePe / GPay / Paytm]
         │
         ▼
[Gmail IMAP Engine Polls ragini.19854@gmail.com via App Password]
         │
         ▼
[Order ID & Payment Email Matched -> Account Instantly Upgraded! 🎉]
```

---

## 💻 Tech Stack

<div align="center">

| Component | Technology |
| :--- | :--- |
| **Frontend UI** | Modern HTML5, Vanilla JavaScript (ES6+), Glassmorphism CSS Design System |
| **Backend REST API** | Node.js, Express.js |
| **Database & Cache** | In-Memory Engine, Redis Compatible |
| **Authentication** | JWT, Google OAuth 2.0, Unified API Keys (`sk-demon-...`) |
| **Email IMAP Engine** | TLS Socket IMAP Connection (`imap.gmail.com:993`) |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | Railway, Hetzner, AWS, DigitalOcean, PM2 |

</div>

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/shubhkumarmishra82-debug/demon-api-platform.git
cd demon-api-platform
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your configuration:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=demon_super_secret_jwt_key_2026

# FamPay & IMAP Credentials
FAMPAY_UPI_ID=madara412@fam
GMAIL_USER=ragini.19854@gmail.com
GMAIL_APP_PASSWORD=yhzlqqhtsxeaoztg
```

### 3. Install & Start Server
```bash
npm install
npm start
```

Open your browser at `http://localhost:3000`.

---

## 📦 Deployment Guide

### Option 1: Railway (1-Click Deploy)
1. Fork or push this repository to your GitHub account.
2. Log into [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub Repo**.
4. Select `demon-api-platform` -> Railway automatically builds and deploys via `railway.json`!

### Option 2: Docker Compose (VPS)
```bash
docker compose up -d --build
```

### Option 3: PM2 (Node.js VPS)
```bash
npm install -g pm2
pm2 start server.js --name demon-api
```

---

## 📜 SDK Code Examples

### cURL
```bash
curl -X POST https://api.demonapi.com/v1/ai/chat \
  -H "Authorization: Bearer sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain Quantum Computing in 2 sentences"}'
```

### Python
```python
import requests

url = "http://localhost:3000/api/v1/ai/chat"
headers = {"Authorization": "Bearer sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"}
payload = {"prompt": "Write a python telegram bot script"}

response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

### Node.js
```javascript
const response = await fetch("http://localhost:3000/api/v1/ai/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt: "Hello Demon API" })
});
const data = await response.json();
console.log(data);
```

---

<div align="center">

  <sub>Built with ❤️ for Developers, Telegram Bots, and Discord Bots. Licensed under MIT.</sub>

</div>


# Server Configuration
PORT=3000
NODE_ENV=production
JWT_SECRET=demon_super_secret_jwt_key_2026

# FamPay UPI & IMAP Auto-Payment Credentials
FAMPAY_UPI_ID=madara412@fam
GMAIL_USER=ragini.19854@gmail.com
GMAIL_APP_PASSWORD=yhzlqqhtsxeaoztg
IMAP_HOST=imap.gmail.com
IMAP_PORT=993

# Master Admin Gmail Accounts (Comma Separated)
ADMIN_EMAILS=ragini.19854@gmail.com,shubhkumarmishra82@gmail.com
