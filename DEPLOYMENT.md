# Demon API Platform - Deployment Guide

This guide explains how to deploy **Demon API Platform** directly to **Railway**, **Docker VPS**, **Render**, or **DigitalOcean**.

---

## Option 1: Deploy to Railway (Recommended - 1 Click)

1. Push this project repository to **GitHub**.
2. Log into [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your `demon-api-platform` repository.
5. Railway will automatically detect `railway.json` and `Dockerfile` and deploy the project!
6. Under **Settings** -> **Domains**, generate a public domain (e.g. `demon-api.up.railway.app`).

---

## Option 2: Deploy to VPS using Docker Compose

1. Connect to your VPS via SSH:
   ```bash
   ssh root@your-vps-ip
   ```

2. Clone your repository:
   ```bash
   git clone https://github.com/your-username/demon-api-platform.git
   cd demon-api-platform
   ```

3. Launch containers:
   ```bash
   docker compose up -d --build
   ```

4. Verify server status:
   ```bash
   docker compose logs -f
   ```

Your platform will now be running live on port 3000!

---

## Option 3: Manual PM2 Execution on VPS

1. Install Node.js & PM2:
   ```bash
   npm install -g pm2
   ```
2. Start server:
   ```bash
   pm2 start server.js --name demon-api
   pm2 save
   pm2 startup
   ```
