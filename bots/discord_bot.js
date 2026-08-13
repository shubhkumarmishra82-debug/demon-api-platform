/**
 * Demon API Platform - Discord Bot Integration (Node.js)
 * Usage:
 *   npm install discord.js
 *   node discord_bot.js
 */

const { Client, GatewayIntentBits } = require('discord.js');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'YOUR_DISCORD_BOT_TOKEN_HERE';
const DEMON_API_KEY = process.env.DEMON_API_KEY || 'sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c';
const DEMON_BASE_URL = 'http://localhost:3000/api/v1';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`⚡ Demon API Discord Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!demon ai')) {
    const prompt = message.content.replace('!demon ai', '').trim();
    if (!prompt) return message.reply('Usage: `!demon ai <prompt>`');

    message.channel.send('🧠 Demon AI is generating response...');

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
      message.reply(`🤖 **Demon AI**:\n${data.response}`);
    } catch (e) {
      message.reply(`❌ Error connecting to Demon API: ${e.message}`);
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
