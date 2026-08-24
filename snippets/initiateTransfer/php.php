<?php

use Yabacon\Paystack;

$paystack = new Paystack(getenv('PAYSTACK_SECRET_KEY'));
$transfer = $paystack->transfer->create([
  'source' => 'balance',
  'amount' => 50000,
  'recipient' => 'RCP_1234567890',
  'reason' => 'Monthly bonus'
]);

echo 'Transfer code: ' . $transfer->data->transfer_code;