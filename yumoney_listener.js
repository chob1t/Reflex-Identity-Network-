// yumoney_listener.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/yumoney/webhook', (req, res) => {
  const txn = req.body;
  if (txn.amount >= 499 && txn.description === 'vasydrop_premium') {
    console.log(`💸 ЮMoney платёж от ${txn.from_account}`);
    grantLicense(txn.from_account); // активируем доступ
  }
  res.status(200).send({ ok: true });
});
