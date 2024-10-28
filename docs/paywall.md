# Paywall Feature

This feature will block user to use our platform before they fill their payment method wether Credit Card or Alipay. However, with current `subscriptions` table structure, there's something needs to be done on the next development.

## Technical-Debt Logic

If you see on `subscriptions` table, we create a virtual subscription status (trial, trial expired, trial cancelled, active, paused, pass due, and cancelled) by add several logic using `activeAt`, `pausedAt` and `cancelledAt` column. In this context, ideally we add 1 column to say that the data is trial or not and then we can decide if the user is on trial subscription or the user has requested to cancel the trial.

But, currently we use this logic to achieve that:

```typescript
const cancelledAt = new Date(new Date().getTime()+(5 * 24 * 60 * 60 * 1000)) // 5 days ahead
const currentTime = new Date();
const { trial_days } = { 5 };
const dayDifference = dayjs(currentTime).diff(dayjs(cancelledAt), 'day');
const trialCancelled = activeAt !== null && cancelledAt !== null && currentTime < cancelledAt && dayDifference < +trial_days
```

You can find this code on `src/backend/database/subcription/subscription-entity.ts`

We also adjusted the flow for cancelling subscription several endpoints:

- Cancel Endpoint: `[DELETE] /api/v2/subscriptions`
- Resume Endpoint: `[PUT] /api/v2/subscriptions/[subscriptionId]` => `subscriptionId = 'resume'`
- Stripe callback: `[POST] /api/v2/stripe-webhook` => to be precise on `customerSubscriptionUpdatedHandler` method

in the future, we might need to change the flow to be more effective and less complicated logic
