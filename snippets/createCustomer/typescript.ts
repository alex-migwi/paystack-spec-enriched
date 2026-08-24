import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

const customer = await paystack.customers.create({
  email: 'customer@example.com',
  first_name: 'Alex',
  last_name: 'Developer',
  phone: '+2348012345678'
});

console.log('Customer code:', customer.data.customer_code);