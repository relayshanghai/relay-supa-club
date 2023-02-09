// The defaults are from our testing account
export const STRIPE_PRODUCT_ID_DIY = process.env.STRIPE_PRODUCT_ID_DIY || 'prod_MskCkXTZd6tim9';
export const STRIPE_PRICE_MONTHLY_DIY =
    process.env.STRIPE_PRICE_MONTHLY_DIY || 'price_1MNB61As9LEfZQ298w3oW64k';
export const STRIPE_PRICE_QUARTERLY_DIY =
    process.env.STRIPE_PRICE_QUARTERLY_DIY || 'price_1MNB5iAs9LEfZQ29sssMyA6m';
export const STRIPE_PRICE_YEARLY_DIY =
    process.env.STRIPE_PRICE_YEARLY_DIY || 'price_1M8yhpAs9LEfZQ29TSiaQVun';

export const STRIPE_PRODUCT_ID_DIY_MAX =
    process.env.STRIPE_PRODUCT_ID_DIY_MAX || 'prod_N7PH5AciWQkPyv';
export const STRIPE_PRICE_MONTHLY_DIY_MAX =
    process.env.STRIPE_PRICE_MONTHLY_DIY_MAX || 'price_1MNAT0As9LEfZQ292rmiX8Cj';
export const STRIPE_PRICE_QUARTERLY_DIY_MAX =
    process.env.STRIPE_PRICE_QUARTERLY_DIY_MAX || 'price_1MNBZ8As9LEfZQ294QasjNYv';
export const STRIPE_PRICE_YEARLY_DIY_MAX =
    process.env.STRIPE_PRICE_YEARLY_DIY_MAX || 'price_1MNBZ8As9LEfZQ29vph62DoE';

export const STRIPE_PRODUCT_ID_VIP = process.env.STRIPE_PRODUCT_ID_VIP || 'prod_NJ1l6867a0bkhL';
export const DEFAULT_VIP_PROFILES_LIMIT = '10000';
export const DEFAULT_VIP_SEARCHES_LIMIT = '800';
