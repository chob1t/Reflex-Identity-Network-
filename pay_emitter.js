// pay_emitter.js
const { stripe } = require('./stripe_config');

async function createCheckoutSession(productName, price, successUrl, cancelUrl) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: productName },
        unit_amount: price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session.url;
}
