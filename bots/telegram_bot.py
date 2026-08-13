"""
Demon API Platform - Telegram Bot Integration (Python)
Usage:
    pip install python-telegram-bot requests
    python telegram_bot.py
"""

import logging
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# Configuration
TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_HERE"
DEMON_API_KEY = "sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"
DEMON_BASE_URL = "http://localhost:3000/api/v1"

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome = (
        "😈 *Welcome to Demon API Telegram Bot!*\n\n"
        "Available Commands:\n"
        "/ai <prompt> - Ask Demon AI\n"
        "/joke - Get a programmer joke\n"
        "/quote - Get an inspirational quote\n"
        "/ip - Look up IP information\n"
    )
    await update.message.reply_text(welcome, parse_mode="Markdown")

async def ai_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    prompt = " ".join(context.args)
    if not prompt:
        await update.message.reply_text("Usage: /ai <your question>")
        return

    await update.message.reply_text("🧠 *Demon AI is thinking...*", parse_mode="Markdown")

    headers = {"Authorization": f"Bearer {DEMON_API_KEY}"}
    try:
        res = requests.post(f"{DEMON_BASE_URL}/ai/chat", headers=headers, json={"prompt": prompt})
        data = res.json()
        if data.get("success"):
            reply = data.get("response")
            await update.message.reply_text(f"🤖 *Demon AI*:\n{reply}", parse_mode="Markdown")
        else:
            await update.message.reply_text("❌ Demon API Error: " + data.get("error", "Unknown error"))
    except Exception as e:
        await update.message.reply_text(f"❌ Error connecting to Demon API: {str(e)}")

async def joke_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    headers = {"Authorization": f"Bearer {DEMON_API_KEY}"}
    try:
        res = requests.get(f"{DEMON_BASE_URL}/fun/joke", headers=headers)
        data = res.json()
        await update.message.reply_text(f"😂 {data.get('joke', 'No joke found')}")
    except Exception as e:
        await update.message.reply_text("Error fetching joke")

if __name__ == "__main__":
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ai", ai_handler))
    app.add_handler(CommandHandler("joke", joke_handler))
    print("🚀 Demon API Telegram Bot started...")
    app.run_polling()
