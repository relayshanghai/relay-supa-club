import { Stripe } from 'stripe';
// eslint-disable-next-line no-console
if (!process.env.STRIPE_API_KEY) console.log('STRIPE_API_KEY not set');
export const stripeClient = new Stripe(process.env.STRIPE_API_KEY || '', {} as any);
