# Stripe

## Testing

To test Stripe Webhooks locally, you can use [Stripe CLI](https://stripe.com/docs/stripe-cli).

You'll probably want to be using the TEST_MODE account, so check your `.env.local` file that you are using

```
STRIPE_API_KEY=sk_test_.... # starts with sk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_.... # starts with pk_test_
```

```
stripe login

stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

## Dummy credit card

use 4242 4242 4242 4242 for a dummy credit card on the test mode app
