import com.paystack.PaystackClient;
import com.paystack.models.TransactionInitializeRequest;
import com.paystack.models.TransactionInitializeResponse;

public class Main {
    public static void main(String[] args) {
        PaystackClient client = new PaystackClient(System.getenv("PAYSTACK_SECRET_KEY"));
        
        TransactionInitializeRequest request = new TransactionInitializeRequest()
            .email("customer@example.com")
            .amount(50000)
            .currency("NGN");
            
        TransactionInitializeResponse response = client.transactions().initialize(request);
        System.out.println("Authorization URL: " + response.getData().getAuthorizationUrl());
    }
}
