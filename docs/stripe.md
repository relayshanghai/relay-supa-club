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
```

```
stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

You'll get a result like

```
> Ready! You are using Stripe API Version [2022-11-15]. Your webhook signing secret is whsec_33e379d010c59ef1b04980aff166945e18d3d2f60136c18e9ac21148911046bd (^C to quit)
```

copy that secret into

```
# .env.local
STRIPE_SIGNING_SECRET=...
```

## Dummy credit card

use 4242 4242 4242 4242 for a dummy credit card on the test mode app
