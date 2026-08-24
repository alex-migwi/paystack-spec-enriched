import Paystack

Paystack.setPublicKey("pk_test_...")

let charge = PSTransactionParams()
charge.amount = 50000
charge.email = "customer@example.com"
charge.currency = "NGN"

Paystack.chargeCard(charge, for: self, didEndWithError: { error, reference in
    if let error = error {
        print("Error: \(error.localizedDescription)")
    } else if let reference = reference {
        print("Transaction reference: \(reference)")
    }
})
