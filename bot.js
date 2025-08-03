 — NUMNet Webhook-ready for Vercel
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());

const token = config.telegram.token;
const bot = new TelegramBot(token);
bot.setWebHook(`${config.telegram.webhook_url}/b

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Добро пожаловать в NUMNet, ${msg.from.first_name}!`);
});

bot.onText(/\/grant (.+)/, (msg, match) => {
  const userId = msg.chat.id.toString();
  const tokenName = match[1];
  if (config.admin.includes(userId)) {
    config.granted[userId] = tokenName;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    bot.sendMessage(msg.chat.id, `✅ Выдан токен: ${tokenName}`);
  } else {
    bot.sendMessage(msg.chat.id, '⛔ Недостаточно прав.');
  }
});

bot.onText(/\/token/, (msg) => {
  const token = config.granted[msg.chat.id.toString()];
  bot.sendMessage(msg.chat.id, token ? `🔐 Ваш токен: ${token}` : `🔓 У вас нет токена.`);
});

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Экспорт для Vercel
module.exports = app;

// Показ лицензии
bot.onText(/\/license/, (msg) => {
  bot.sendMessage(msg.chat.id, `📜 NUMNet лицензирован под BUSL-1.1. Подробнее: https://github.com/chob1t/Reflex-Identity-Network-/blob/main/LICENSE.md`);
});

// Кошелёк
bot.onText(/\/wallet/, (msg) => {
  const text = `💸 Адреса для оплаты:\nTRX: ${config.wallet.trx}\nETH: ${config.wallet.eth}`;
  bot.sendMessage(msg.chat.id, text);
});
// Подключаем модуль деплоя
const { exec } = require('child_process');

bot.onText(/\/deploy_contract/, (msg) => {
  const userId = msg.chat.id;
  if (config.admin.includes(userId.toString())) {
    bot.sendMessage(userId, `🚀 Запускаю развёртывание NUMNet контракта...`);
    
    exec('node deploy_contract.js', (error, stdout, stderr) => {
      if (error) {
        bot.sendMessage(userId, `⛔ Ошибка: ${error.message}`);
        return;
      }
      if (stderr) {
        bot.sendMessage(userId, `⚠️ Предупреждение: ${stderr}`);
      }
      bot.sendMessage(userId, `✅ Ответ:\n${stdout}`);
    });
  } else {
    bot.sendMessage(userId, `⛔ У вас нет прав на развёртывание контрактов.`);
  }
});

