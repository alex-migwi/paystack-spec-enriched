import os
from paystack import Paystack

paystack = Paystack(secret_key=os.environ.get("PAYSTACK_SECRET_KEY"))

transfer = paystack.transfers.initiate(
    source="balance",
    amount=50000,
    recipient="RCP_1234567890",
    reason="Monthly bonus"
)

print(f"Transfer initiated: {transfer.data.transfer_code}")