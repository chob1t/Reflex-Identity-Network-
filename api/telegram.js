// api/telegram.js — Serverless Webhook для Vercel
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not defined');

const bot = new TelegramBot(token);

// ⚠️ Не вызываем bot.setWebHook() — Telegram вызывает вручную

// Хендлер для Webhook — Vercel будет слать POST-запросы
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      console.log('📨 Входящий запрос Telegram:', JSON.stringify(req.body, null, 2));

      await bot.processUpdate(req.body);
      res.status(200).send('✅ OK');
    } else {
      res.status(404).send('🚫 Not Found');
    }
  } catch (err) {
    console.error('💥 Ошибка обработки запроса:', err);
    res.status(500).send('❌ Internal Server Error');
  }
};

