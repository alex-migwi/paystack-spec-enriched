import com.paystack.PaystackClient;
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
}