const response = await paystack.transactions.initialize({
  email: "customer@email.com",
  amount: "500000",
  currency: "NGN",
  callback_url: "https://yourdomain.com/callback"
});
console.log(response.data.authorization_url);
