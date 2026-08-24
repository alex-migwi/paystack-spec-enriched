require 'paystack'

paystack = Paystack.new(ENV['PAYSTACK_SECRET_KEY'])
transactions = PaystackTransactions.new(paystack)

result = transactions.initializeTransaction(
  email: 'customer@example.com',
  amount: 50000,
  currency: 'NGN'
)

puts "Authorization URL: #{result['data']['authorization_url']}"
