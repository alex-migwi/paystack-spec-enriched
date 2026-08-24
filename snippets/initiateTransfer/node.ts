import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const transfer = await paystack.transfers.initiate({
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus'
});

console.log('Transfer code:', transfer.data.transfer_code);