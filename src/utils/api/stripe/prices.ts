import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata, RelayPlan } from 'types';
import {
    STRIPE_PRICE_MONTHLY_DIY,
    STRIPE_PRICE_MONTHLY_DIY_MAX,
    STRIPE_PRICE_QUARTERLY_DIY,
    STRIPE_PRICE_QUARTERLY_DIY_MAX,
    STRIPE_PRICE_YEARLY_DIY,
    STRIPE_PRICE_YEARLY_DIY_MAX,
    STRIPE_PRODUCT_ID_DIY,
    STRIPE_PRODUCT_ID_DIY_MAX,
} from './constants';
import { stripeClient } from './stripe-client';

/** Stripe prices come in cents,  divide by 1 hundred, and return a string with 2 decimal places */
export const formatStripePrice = (price: number) => (price / 100).toFixed(2);

export const getStripePlanPrices = async () => {
    const diyPrices = (await stripeClient.prices.list({
        active: true,
        expand: ['data.product'],
        product: STRIPE_PRODUCT_ID_DIY,
    })) as Stripe.ApiList<StripePriceWithProductMetadata>;
    const diyMaxPrices = (await stripeClient.prices.list({
        active: true,
        expand: ['data.product'],
        product: STRIPE_PRODUCT_ID_DIY_MAX,
    })) as Stripe.ApiList<StripePriceWithProductMetadata>;

    if (!diyPrices.data || !diyMaxPrices.data) throw new Error('no plans found');
    const diyMonthly = diyPrices.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DIY);
    const diyQuarterly = diyPrices.data.find(({ id }) => id === STRIPE_PRICE_QUARTERLY_DIY);
    const diyAnnually = diyPrices.data.find(({ id }) => id === STRIPE_PRICE_YEARLY_DIY);
    const diyMaxMonthly = diyMaxPrices.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DIY_MAX);
    const diyMaxQuarterly = diyMaxPrices.data.find(({ id }) => id === STRIPE_PRICE_QUARTERLY_DIY_MAX);
    const diyMaxAnnually = diyMaxPrices.data.find(({ id }) => id === STRIPE_PRICE_YEARLY_DIY_MAX);

    const currency = diyMonthly?.currency;

    if (
        !diyMonthly?.unit_amount ||
        !diyQuarterly?.unit_amount ||
        !diyAnnually?.unit_amount ||
        !diyMaxMonthly?.unit_amount ||
        !diyMaxQuarterly?.unit_amount ||
        !diyMaxAnnually?.unit_amount ||
        !currency ||
        !diyMonthly.product?.metadata.profiles ||
        !diyMonthly.product?.metadata.searches ||
        !diyMaxMonthly.product?.metadata.profiles ||
        !diyMaxMonthly.product?.metadata.searches
    ) {
        throw new Error('missing plan information');
    }

    const response: { diy: RelayPlan; diyMax: RelayPlan } = {
        diy: {
            currency,
            prices: {
                monthly: formatStripePrice(diyMonthly.unit_amount),
                quarterly: formatStripePrice(diyQuarterly.unit_amount),
                annually: formatStripePrice(diyAnnually.unit_amount),
            },
            profiles: diyMonthly.product.metadata.profiles,
            searches: diyMonthly.product.metadata.searches,
            priceIds: {
                monthly: diyMonthly.id,
                quarterly: diyQuarterly.id,
                annually: diyAnnually.id,
            },
        },
        diyMax: {
            currency,
            prices: {
                monthly: formatStripePrice(diyMaxMonthly.unit_amount),
                quarterly: formatStripePrice(diyMaxQuarterly.unit_amount),
                annually: formatStripePrice(diyMaxAnnually.unit_amount),
            },
            profiles: diyMaxMonthly.product.metadata.profiles,
            searches: diyMaxMonthly.product.metadata.searches,
            priceIds: {
                monthly: diyMaxMonthly.id,
                quarterly: diyMaxQuarterly.id,
                annually: diyMaxAnnually.id,
            },
        },
    };
    return response;
};
