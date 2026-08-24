package main

import (
	"fmt"
	"os"
	"github.com/paystack/paystack-go"
)

func main() {
	apiKey := os.Getenv("PAYSTACK_SECRET_KEY")
	client := paystack.NewClient(apiKey, nil)

	req := &paystack.TransactionRequest{
		Email:    "customer@example.com",
		Amount:   50000,
		Currency: "NGN",
	}

	res, err := client.Transaction.Initialize(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("Authorization URL:", res["data"].(map[string]interface{})["authorization_url"])
}
