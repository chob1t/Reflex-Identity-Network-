const fs = require('fs');
const config = require('./config.json');

bot.onText(/\/grant/, (msg) => {
  const adminID = msg.chat.id.toString();
  const targetID = msg.from.id.toString();

  if (!config.authorized.includes(adminID)) {
    bot.sendMessage(adminID, '🚫 Нет прав на выдачу токенов.');
    return;
  }

  if (config.granted.includes(targetID)) {
    bot.sendMessage(adminID, '⚠️ Токен уже выдан этому пользователю.');
    return;
  }

  config.granted.push(targetID);
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

  bot.sendMessage(adminID, `✅ Токен выдан пользователю ${targetID}`);
});
