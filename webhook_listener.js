// webhook_listener.js
const express = require('express');
const app = express();
const stripe = require('./stripe_config').stripe;
app.use(express.json());

app.post('/webhook', (req, res) => {
  const event = req.body;
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('💰 Платёж завершён:', session.id);
      break;
    default:
      console.log(`📨 Событие Stripe: ${event.type}`);
  }
  res.sendStatus(200);
});
