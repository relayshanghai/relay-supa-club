// The defaults are from our testing account
export const STRIPE_PRODUCT_ID_DIY = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_DIY || '';
export const STRIPE_PRICE_MONTHLY_DIY = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_DIY || '';
export const STRIPE_PRICE_QUARTERLY_DIY = process.env.NEXT_PUBLIC_STRIPE_PRICE_QUARTERLY_DIY || '';
export const STRIPE_PRICE_YEARLY_DIY = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_DIY || '';

export const STRIPE_PRODUCT_ID_DIY_MAX = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_DIY_MAX || '';
export const STRIPE_PRICE_MONTHLY_DIY_MAX = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_DIY_MAX || '';
export const STRIPE_PRICE_QUARTERLY_DIY_MAX = process.env.NEXT_PUBLIC_STRIPE_PRICE_QUARTERLY_DIY_MAX || '';
export const STRIPE_PRICE_YEARLY_DIY_MAX = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_DIY_MAX || '';

export const STRIPE_PRODUCT_ID_VIP = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_VIP || '';
export const DEFAULT_VIP_PROFILES_LIMIT = '10000';
export const DEFAULT_VIP_SEARCHES_LIMIT = '800';
export const DEFAULT_VIP_AI_EMAILS_LIMIT = '1000';

if (
    !STRIPE_PRICE_MONTHLY_DIY ||
    !STRIPE_PRICE_MONTHLY_DIY_MAX ||
    !STRIPE_PRICE_QUARTERLY_DIY ||
    !STRIPE_PRICE_QUARTERLY_DIY_MAX ||
    !STRIPE_PRICE_YEARLY_DIY ||
    !STRIPE_PRICE_YEARLY_DIY_MAX ||
    !STRIPE_PRODUCT_ID_DIY ||
    !STRIPE_PRODUCT_ID_DIY_MAX ||
    !STRIPE_PRODUCT_ID_VIP
) {
    throw new Error('Stripe price ids are not set');
}
