final customer = await paystack.createCustomer(
  email: 'customer@example.com',
  firstName: 'Alex',
  lastName: 'Developer',
);