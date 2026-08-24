require 'paystack'

paystack = Paystack.new(ENV['PAYSTACK_SECRET_KEY'])
customers = PaystackCustomers.new(paystack)

result = customers.create(
  email: 'customer@example.com',
  first_name: 'Alex',
  last_name: 'Developer'
)

puts "Customer Code: #{result['data']['customer_code']}"