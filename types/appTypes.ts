import type Stripe from 'stripe';

export type StripePlanWithPrice = Stripe.Product & { prices?: Stripe.Plan[] };
export type StripePaymentMethods = Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>;

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };
