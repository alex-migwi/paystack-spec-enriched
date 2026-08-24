let transfer = TransferParams()
transfer.source = "balance"
transfer.amount = 50000
transfer.recipient = "RCP_1234567890"

Paystack.initiateTransfer(transfer) { response in
    print("Transfer Code: (response.transferCode)")
}