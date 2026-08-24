package main

import (
	"fmt"
	"os"
	"github.com/paystack/paystack-go"
)

func main() {
	client := paystack.NewClient(os.Getenv("PAYSTACK_SECRET_KEY"), nil)
	trf, _ := client.Transfer.Initiate(&paystack.TransferRequest{
		Source:    "balance",
		Amount:    50000,
		Recipient: "RCP_1234567890",
		Reason:    "Monthly bonus",
	})
	fmt.Println("Transfer Code:", trf["data"].(map[string]interface{})["transfer_code"])
}