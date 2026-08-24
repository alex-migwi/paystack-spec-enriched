<?php

use Yabacon\Paystack;

$paystack = new Paystack(getenv('PAYSTACK_SECRET_KEY'));

$tranx = $paystack->transaction->initialize([
  'amount' => 50000,
  'email' => 'customer@example.com',
  'currency' => 'NGN',
  'callback_url' => 'https://yourwebsite.com/payment/callback'
]);

echo 'Authorization URL: ' . $tranx->data->authorization_url;
