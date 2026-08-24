let customer = CustomerParams()
customer.email = "customer@example.com"
customer.firstName = "Alex"
customer.lastName = "Developer"

Paystack.createCustomer(customer) { response in
    print("Customer code: (response.customerCode)")
}