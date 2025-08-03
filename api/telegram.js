// api/telegram.js — Serverless Webhook для Vercel
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('../config.json');
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token);
bot.setWebHook(`${config.telegram.webhook_url}/api/telegram`);
bot.sendMessage(chatId, "Купить доступ", {
  reply_markup: {
    inline_keyboard: [[
      { text: "Оплатить 150₽", url: quickpay.redirected_url }
    ]]
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Привет, ${msg.from.first_name}! Добро пожаловать в NUMNet`);
});

bot.onText(/\/grant (.+)/, (msg, match) => {
  const userId = msg.chat.id.toString();
  const tokenName = match[1];
  if (config.admin.includes(userId)) {
    config.granted[userId] = tokenName;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    bot.sendMessage(userId, `✅ Выдан токен: ${tokenName}`);
  } else {
    bot.sendMessage(userId, '⛔ Недостаточно прав.');
  }
});

bot.onText(/\/token/, (msg) => {
  const token = config.granted[msg.chat.id.toString()];
  bot.sendMessage(msg.chat.id, token ? `🔐 Ваш токен: ${token}` : `🔓 У вас нет токена.`);
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await bot.processUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(404).send('Not found');
  }
};
