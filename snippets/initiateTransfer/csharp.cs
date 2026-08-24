using System;
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
}