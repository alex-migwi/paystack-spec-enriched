import 'package:flutter_paystack/flutter_paystack.dart';

final plugin = PaystackPlugin();
plugin.initialize(publicKey: 'pk_test_...');

Charge charge = Charge()
  ..amount = 50000
  ..email = 'customer@example.com'
  ..currency = 'NGN';

CheckoutResponse response = await plugin.checkout(
  context,
  method: CheckoutMethod.card,
  charge: charge,
);

if (response.status) {
  print('Transaction reference: ${response.reference}');
}
