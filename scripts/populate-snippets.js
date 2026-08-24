const fs = require('fs');
const path = require('path');

const snippetsDir = path.join(__dirname, '../snippets');

const operations = {
  createCustomer: {
    'curl.sh': `curl -X POST "https://api.paystack.co/customer" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "customer@example.com",
    "first_name": "Alex",
    "last_name": "Developer",
    "phone": "+2348012345678"
  }'`,
    'node.ts': `import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const customer = await paystack.customers.create({
  email: 'customer@example.com',
  first_name: 'Alex',
  last_name: 'Developer',
  phone: '+2348012345678'
});

console.log('Customer created:', customer.data.customer_code);`,
    'typescript.ts': `import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

const customer = await paystack.customers.create({
  email: 'customer@example.com',
  first_name: 'Alex',
  last_name: 'Developer',
  phone: '+2348012345678'
});

console.log('Customer code:', customer.data.customer_code);`,
    'python.py': `import os
from paystack import Paystack

paystack = Paystack(secret_key=os.environ.get("PAYSTACK_SECRET_KEY"))

customer = paystack.customers.create(
    email="customer@example.com",
    first_name="Alex",
    last_name="Developer",
    phone="+2348012345678"
)

print(f"Customer created: {customer.data.customer_code}")`,
    'php.php': `<?php

use Yabacon\\Paystack;

$paystack = new Paystack(getenv('PAYSTACK_SECRET_KEY'));
$customer = $paystack->customer->create([
  'email' => 'customer@example.com',
  'first_name' => 'Alex',
  'last_name' => 'Developer',
  'phone' => '+2348012345678'
]);

echo 'Customer code: ' . $customer->data->customer_code;`,
    'go.go': `package main

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
}`,
    'java.java': `import com.paystack.PaystackClient;
import com.paystack.models.CustomerRequest;

public class Main {
    public static void main(String[] args) {
        PaystackClient client = new PaystackClient(System.getenv("PAYSTACK_SECRET_KEY"));
        var request = new CustomerRequest()
            .email("customer@example.com")
            .firstName("Alex")
            .lastName("Developer");
        var response = client.customers().create(request);
        System.out.println("Customer Code: " + response.getData().getCustomerCode());
    }
}`,
    'csharp.cs': `using System;
using System.Threading.Tasks;
using Paystack.Net.SDK;

class Program {
    static async Task Main() {
        var api = new PaystackApi(Environment.GetEnvironmentVariable("PAYSTACK_SECRET_KEY"));
        var response = await api.Customers.Create(new CustomerCreateRequest {
            Email = "customer@example.com",
            FirstName = "Alex",
            LastName = "Developer"
        });
        Console.WriteLine($"Customer Code: {response.Data.CustomerCode}");
    }
}`,
    'ruby.rb': `require 'paystack'

paystack = Paystack.new(ENV['PAYSTACK_SECRET_KEY'])
customers = PaystackCustomers.new(paystack)

result = customers.create(
  email: 'customer@example.com',
  first_name: 'Alex',
  last_name: 'Developer'
)

puts "Customer Code: #{result['data']['customer_code']}"`,
    'flutter.dart': `final customer = await paystack.createCustomer(
  email: 'customer@example.com',
  firstName: 'Alex',
  lastName: 'Developer',
);`,
    'kotlin.kt': `val customerRequest = CustomerRequest(
    email = "customer@example.com",
    firstName = "Alex",
    lastName = "Developer"
)
paystackSdk.createCustomer(customerRequest) { response ->
    println("Customer code: \${response.customerCode}")
}`,
    'swift.swift': `let customer = CustomerParams()
customer.email = "customer@example.com"
customer.firstName = "Alex"
customer.lastName = "Developer"

Paystack.createCustomer(customer) { response in
    print("Customer code: \(response.customerCode)")
}`
  },

  initiateTransfer: {
    'curl.sh': `curl -X POST "https://api.paystack.co/transfer" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "balance",
    "amount": 50000,
    "recipient": "RCP_1234567890",
    "reason": "Monthly bonus"
  }'`,
    'node.ts': `import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const transfer = await paystack.transfers.initiate({
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus'
});

console.log('Transfer code:', transfer.data.transfer_code);`,
    'typescript.ts': `import { Paystack } from '@paystack/paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

const transfer = await paystack.transfers.initiate({
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus'
});

console.log('Transfer code:', transfer.data.transfer_code);`,
    'python.py': `import os
from paystack import Paystack

paystack = Paystack(secret_key=os.environ.get("PAYSTACK_SECRET_KEY"))

transfer = paystack.transfers.initiate(
    source="balance",
    amount=50000,
    recipient="RCP_1234567890",
    reason="Monthly bonus"
)

print(f"Transfer initiated: {transfer.data.transfer_code}")`,
    'php.php': `<?php

use Yabacon\\Paystack;

$paystack = new Paystack(getenv('PAYSTACK_SECRET_KEY'));
$transfer = $paystack->transfer->create([
  'source' => 'balance',
  'amount' => 50000,
  'recipient' => 'RCP_1234567890',
  'reason' => 'Monthly bonus'
]);

echo 'Transfer code: ' . $transfer->data->transfer_code;`,
    'go.go': `package main

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
}`,
    'java.java': `import com.paystack.PaystackClient;
import com.paystack.models.TransferRequest;

public class Main {
    public static void main(String[] args) {
        PaystackClient client = new PaystackClient(System.getenv("PAYSTACK_SECRET_KEY"));
        var request = new TransferRequest()
            .source("balance")
            .amount(50000)
            .recipient("RCP_1234567890")
            .reason("Monthly bonus");
        var response = client.transfers().initiate(request);
        System.out.println("Transfer Code: " + response.getData().getTransferCode());
    }
}`,
    'csharp.cs': `using System;
using System.Threading.Tasks;
using Paystack.Net.SDK;

class Program {
    static async Task Main() {
        var api = new PaystackApi(Environment.GetEnvironmentVariable("PAYSTACK_SECRET_KEY"));
        var response = await api.Transfers.Initiate(new TransferInitiateRequest {
            Source = "balance",
            Amount = 50000,
            Recipient = "RCP_1234567890",
            Reason = "Monthly bonus"
        });
        Console.WriteLine($"Transfer Code: {response.Data.TransferCode}");
    }
}`,
    'ruby.rb': `require 'paystack'

paystack = Paystack.new(ENV['PAYSTACK_SECRET_KEY'])
transfers = PaystackTransfers.new(paystack)

result = transfers.initiate(
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus'
)

puts "Transfer Code: #{result['data']['transfer_code']}"`,
    'flutter.dart': `final transfer = await paystack.initiateTransfer(
  source: 'balance',
  amount: 50000,
  recipient: 'RCP_1234567890',
  reason: 'Monthly bonus',
);`,
    'kotlin.kt': `val transferRequest = TransferRequest(
    source = "balance",
    amount = 50000,
    recipient = "RCP_1234567890",
    reason = "Monthly bonus"
)
paystackSdk.initiateTransfer(transferRequest) { response ->
    println("Transfer Code: \${response.transferCode}")
}`,
    'swift.swift': `let transfer = TransferParams()
transfer.source = "balance"
transfer.amount = 50000
transfer.recipient = "RCP_1234567890"

Paystack.initiateTransfer(transfer) { response in
    print("Transfer Code: \(response.transferCode)")
}`
  }
};

for (const [opId, files] of Object.entries(operations)) {
  const opDir = path.join(snippetsDir, opId);
  if (!fs.existsSync(opDir)) fs.mkdirSync(opDir, { recursive: true });

  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(opDir, filename), content.trim());
  }
  console.log(`Populated 12 language snippets for ${opId}.`);
}
