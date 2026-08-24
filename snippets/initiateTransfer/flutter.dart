final transfer = await paystack.initiateTransfer(
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus',
);