val transferRequest = TransferRequest(
    source = "balance",
    amount = 50000,
    recipient = "RCP_1234567890",
    reason = "Monthly bonus"
)
paystackSdk.initiateTransfer(transferRequest) { response ->
    println("Transfer Code: ${response.transferCode}")
}