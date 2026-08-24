import com.paystack.PaystackClient;
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
}