// bot.js — NUMNet Telegram Bot Engine
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('./config.json');

const bot = new TelegramBot(config.telegram.token, { polling: true });

// Приветствие
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Привет, ${msg.from.first_name}! Добро пожаловать в NUMNet. Введите /help для списка команд.`);
});

// Выдача токена
bot.onText(/\/grant (.+)/, (msg, match) => {
  const userId = msg.chat.id;
  const tokenName = match[1];
  if (config.admin.includes(userId.toString())) {
    config.granted[userId] = tokenName;
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    bot.sendMessage(userId, `✅ Токен ${tokenName} успешно выдан.`);
  } else {
    bot.sendMessage(userId, `⛔ У вас нет прав для выдачи токенов.`);
  }
});

// Проверка токена
bot.onText(/\/token/, (msg) => {
  const userId = msg.chat.id;
  const token = config.granted[userId];
  if (token) {
    bot.sendMessage(userId, `🔐 Ваш токен: ${token}`);
  } else {
    bot.sendMessage(userId, `🔓 У вас пока нет токена.`);
  }
});

// Показ лицензии
bot.onText(/\/license/, (msg) => {
  bot.sendMessage(msg.chat.id, `📜 NUMNet лицензирован под BUSL-1.1. Подробнее: https://github.com/chob1t/Reflex-Identity-Network-/blob/main/LICENSE.md`);
});

// Кошелёк
bot.onText(/\/wallet/, (msg) => {
  const text = `💸 Адреса для оплаты:\nTRX: ${config.wallet.trx}\nETH: ${config.wallet.eth}`;
  bot.sendMessage(msg.chat.id, text);
});

