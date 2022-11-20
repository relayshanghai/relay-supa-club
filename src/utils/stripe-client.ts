import { Stripe } from 'stripe';

export const stripeClient = new Stripe(process.env.STRIPE_API_KEY!, {} as any);
