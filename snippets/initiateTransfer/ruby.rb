require 'paystack'

paystack = Paystack.new(ENV['PAYSTACK_SECRET_KEY'])
transfers = PaystackTransfers.new(paystack)

result = transfers.initiate(
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus'
)

puts "Transfer Code: #{result['data']['transfer_code']}"