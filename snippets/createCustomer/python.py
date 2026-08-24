import os
from paystack import Paystack

paystack = Paystack(secret_key=os.environ.get("PAYSTACK_SECRET_KEY"))

customer = paystack.customers.create(
    email="customer@example.com",
    first_name="Alex",
    last_name="Developer",
    phone="+2348012345678"
)

print(f"Customer created: {customer.data.customer_code}")