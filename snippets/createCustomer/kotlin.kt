val customerRequest = CustomerRequest(
    email = "customer@example.com",
    firstName = "Alex",
    lastName = "Developer"
)
paystackSdk.createCustomer(customerRequest) { response ->
    println("Customer code: ${response.customerCode}")
}