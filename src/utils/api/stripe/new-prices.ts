import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata, NewRelayPlan } from 'types';
import {
    STRIPE_PRODUCT_ID_DISCOVERY,
    STRIPE_PRODUCT_ID_OUTREACH,
    STRIPE_PRICE_MONTHLY_DISCOVERY,
    STRIPE_PRICE_MONTHLY_OUTREACH,
} from './constants';
import { stripeClient } from './stripe-client';

/** Stripe prices come in cents,  divide by 1 hundred, and return a string with 2 decimal places */
export const formatStripePrice = (price: number) => (price / 100).toFixed(2);

export const getNewStripePlanPrices = async () => {
    const discovery = (await stripeClient.prices.list({
        active: true,
        expand: ['data.product'],
        product: STRIPE_PRODUCT_ID_DISCOVERY,
    })) as Stripe.ApiList<StripePriceWithProductMetadata>;

    const outreach = (await stripeClient.prices.list({
        active: true,
        expand: ['data.product'],
        product: STRIPE_PRODUCT_ID_OUTREACH,
    })) as Stripe.ApiList<StripePriceWithProductMetadata>;

    if (!discovery.data || !outreach.data) throw new Error('no plans found');
    const discoveryMonthly = discovery.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DISCOVERY);
    const outreachMonthly = outreach.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_OUTREACH);

    const currency = discoveryMonthly?.currency;

    if (
        !discoveryMonthly?.unit_amount ||
        !outreachMonthly?.unit_amount ||
        !currency ||
        !discoveryMonthly.product?.metadata.profiles ||
        !discoveryMonthly.product?.metadata.searches ||
        !outreachMonthly.product?.metadata.profiles ||
        !outreachMonthly.product?.metadata.searches
    ) {
        throw new Error('missing plan information');
    }

    const response: { discovery: NewRelayPlan; outreach: NewRelayPlan } = {
        discovery: {
            currency,
            prices: {
                monthly: formatStripePrice(discoveryMonthly.unit_amount),
            },
            profiles: discoveryMonthly.product.metadata.profiles,
            searches: discoveryMonthly.product.metadata.searches,
            priceIds: {
                monthly: discoveryMonthly.id,
            },
        },
        outreach: {
            currency,
            prices: {
                monthly: formatStripePrice(outreachMonthly.unit_amount),
            },
            profiles: outreachMonthly.product.metadata.profiles,
            searches: outreachMonthly.product.metadata.searches,
            priceIds: {
                monthly: outreachMonthly.id,
            },
        },
    };
    return response;
};
