import co.paystack.android.PaystackSdk
import co.paystack.android.model.Charge

PaystackSdk.setPublicKey("pk_test_...")

val charge = Charge().apply {
    amount = 50000
    email = "customer@example.com"
    currency = "NGN"
}

PaystackSdk.chargeCard(activity, charge, object : PaystackSdk.TransactionCallback {
    override fun onSuccess(transaction: Transaction) {
        println("Transaction reference: ${transaction.reference}")
    }

    override fun onError(error: Throwable, transaction: Transaction?) {
        println("Error: ${error.message}")
    }
})
