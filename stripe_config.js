// stripe_config.js
const Stripe = require("stripe");
const stripe = Stripe("sk_test_XXXXXXXXXXXXXXXXXXXX"); // вставь свой API-ключ

module.exports = { stripe };
