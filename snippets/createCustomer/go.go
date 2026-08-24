package main

import (
	"fmt"
	"os"
	"github.com/paystack/paystack-go"
)

func main() {
	client := paystack.NewClient(os.Getenv("PAYSTACK_SECRET_KEY"), nil)
	cust, _ := client.Customer.Create(&paystack.CustomerRequest{
		Email:     "customer@example.com",
		FirstName: "Alex",
		LastName:  "Developer",
		Phone:     "+2348012345678",
	})
	fmt.Println("Customer Code:", cust["data"].(map[string]interface{})["customer_code"])
}