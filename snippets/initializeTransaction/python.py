response = paystack.transactions.initialize(
    email="customer@email.com",
    amount=500000,
    currency="NGN",
    callback_url="https://yourdomain.com/callback"
)
print(response.data.authorization_url)
