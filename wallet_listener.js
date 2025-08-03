// wallet_listener.js — NUMNet Token Grant on Payment
const axios = require('axios');
const fs = require('fs');
const config = require('./config.json');

async function checkWallets() {
  // Проверка TRX через TronGrid
  const tronUrl = `https://api.trongrid.io/v1/accounts/${config.wallet.trx}/transactions`;
  const tronResponse = await axios.get(tronUrl);
  const trxTxns = tronResponse.data.data;

  trxTxns.forEach(tx => {
    const sender = tx.raw_data.contract[0].parameter.value.owner_address;
    const amount = tx.raw_data.contract[0].parameter.value.amount;
    const chatId = getChatIdFromAddress(sender);
    if (amount >= config.paymentThreshold.trx && !config.granted[chatId]) {
      config.granted[chatId] = 'vasydrop_basic';
      fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
      notifyBot(chatId, '✅ TRX-платёж получен. Токен выдан!');
    }
  });

  // Проверка ETH через Etherscan
  const ethUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${config.wallet.eth}&sort=desc&apikey=${config.etherscanApiKey}`;
  const ethResponse = await axios.get(ethUrl);
  const ethTxns = ethResponse.data.result;

  ethTxns.forEach(tx => {
    const sender = tx.from;
    const value = parseFloat(tx.value) / 1e18; // ETH в десят. формате
    const chatId = getChatIdFromAddress(sender);
    if (value >= config.paymentThreshold.eth && !config.granted[chatId]) {
      config.granted[chatId] = 'vasydrop_basic';
      fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
      notifyBot(chatId, '✅ ETH-платёж получен. Токен выдан!');
    }
  });
}

// Простая функция для связи адреса ↔ Chat ID
function getChatIdFromAddress(address) {
  return config.addressMap[address] || null;
}

// Отправка уведомления
function notifyBot(chatId, message) {
  // Можно использовать Telegram API напрямую или импортировать bot.sendMessage
  console.log(`🔔 Chat ${chatId}: ${message}`);
}

// Запуск каждые 60 секунд
setInterval(checkWallets, 60000);
