import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

const transaction = await paystack.transactions.initialize({
  email: 'customer@example.com',
  amount: 50000, // Amount in kobo (500.00 NGN)
  currency: 'NGN',
  callback_url: 'https://yourwebsite.com/payment/callback'
});

console.log('Authorization URL:', transaction.data.authorization_url);
