/**
 * Demon API Platform - Telegram Bot Integration (Node.js)
 * Usage:
 *   npm install telegraf node-fetch
 *   node telegram_bot.js
 */

const { Telegraf } = require('telegraf');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const DEMON_API_KEY = process.env.DEMON_API_KEY || 'sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c';
const DEMON_BASE_URL = 'http://localhost:3000/api/v1';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('😈 Welcome to Demon API Bot!\nCommands:\n/ai <prompt>\n/joke\n/quote'));

bot.command('ai', async (ctx) => {
  const prompt = ctx.message.text.replace('/ai', '').trim();
  if (!prompt) return ctx.reply('Usage: /ai <your prompt>');

  ctx.reply('🧠 Demon AI thinking...');
  try {
    const res = await fetch(`${DEMON_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEMON_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data.success) {
      ctx.reply(`🤖 Demon AI:\n${data.response}`);
    } else {
      ctx.reply(`❌ API Error: ${data.error}`);
    }
  } catch (err) {
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

bot.command('joke', async (ctx) => {
  try {
    const res = await fetch(`${DEMON_BASE_URL}/fun/joke`, {
      headers: { 'Authorization': `Bearer ${DEMON_API_KEY}` }
    });
    const data = await res.json();
    ctx.reply(`😂 ${data.joke}`);
  } catch (e) {
    ctx.reply('Error fetching joke');
  }
});

bot.launch();
console.log('🚀 Demon API Node.js Telegram Bot started...');
