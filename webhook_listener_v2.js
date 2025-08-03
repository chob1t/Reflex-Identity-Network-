if (event.type === 'checkout.session.completed') {
  const email = event.data.object.customer_email;
  grantAccessToLicense(email); // активируем токен vasydrop_premium
  logLicenseGrant(email, 'BUSL-1.1');
}
