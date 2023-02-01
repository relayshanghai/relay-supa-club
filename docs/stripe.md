# Stripe

## Testing

To test Stripe Webhooks locally, you can use [Stripe CLI](https://stripe.com/docs/stripe-cli).

```
stripe login

stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```
