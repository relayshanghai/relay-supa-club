import { Stripe } from 'stripe';
// eslint-disable-next-line no-console
if (!process.env.STRIPE_API_KEY) console.log('STRIPE_API_KEY not set');
/**
 * @deprecated
 */
export const stripeClient = new Stripe(process.env.STRIPE_API_KEY || '', {
    // https://stripe.com/docs/development/dashboard/request-logs#view-your-default-api-version
    apiVersion: '2022-11-15',
});
