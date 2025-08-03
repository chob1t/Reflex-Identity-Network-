const TelegramBot = require('node-telegram-bot-api');
const token = 'ТВОЙ_ТОКЕН_ЗДЕСЬ';  // вставь токен от BotFather
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Бот numreclaimbot готов 🎯`);
});
