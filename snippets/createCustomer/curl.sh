curl -X POST "https://api.paystack.co/customer" \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "first_name": "Alex",
    "last_name": "Developer",
    "phone": "+2348012345678"
  }'