using System;
using System.Threading.Tasks;
using Paystack.Net.SDK;

class Program {
    static async Task Main() {
        var api = new PaystackApi(Environment.GetEnvironmentVariable("PAYSTACK_SECRET_KEY"));
        var response = await api.Transactions.Initialize(new TransactionInitializeRequest {
            Email = "customer@example.com",
            Amount = 50000,
            Currency = "NGN"
        });
        Console.WriteLine($"Authorization URL: {response.Data.AuthorizationUrl}");
    }
}
