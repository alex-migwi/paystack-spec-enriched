curl -X POST "https://api.paystack.co/transfer" \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "balance",
    "amount": 50000,
    "recipient": "RCP_1234567890",
    "reason": "Monthly bonus"
  }'