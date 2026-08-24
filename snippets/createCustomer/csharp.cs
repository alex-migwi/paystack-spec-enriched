using System;
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
}