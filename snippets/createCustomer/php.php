<?php

use Yabacon\Paystack;

$paystack = new Paystack(getenv('PAYSTACK_SECRET_KEY'));
$customer = $paystack->customer->create([
  'email' => 'customer@example.com',
  'first_name' => 'Alex',
  'last_name' => 'Developer',
  'phone' => '+2348012345678'
]);

echo 'Customer code: ' . $customer->data->customer_code;