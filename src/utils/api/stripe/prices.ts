import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata, NewRelayPlan } from 'types';
import {
    STRIPE_PRODUCT_ID_DISCOVERY,
    STRIPE_PRODUCT_ID_OUTREACH,
    STRIPE_PRICE_MONTHLY_DISCOVERY,
    STRIPE_PRICE_MONTHLY_OUTREACH,
    STRIPE_PRICE_MONTHLY_DISCOVERY_USD,
    STRIPE_PRICE_MONTHLY_OUTREACH_USD,
    STRIPE_PRICE_ANNUALLY_DISCOVERY,
    STRIPE_PRICE_ANNUALLY_DISCOVERY_USD,
    STRIPE_PRICE_ANNUALLY_OUTREACH,
    STRIPE_PRICE_ANNUALLY_OUTREACH_USD,
} from './constants';
import { stripeClient } from './stripe-client';

/** Stripe prices come in cents,  divide by 1 hundred */
export const formatStripePrice = (price: number) => (price / 100).toFixed(0);

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
    const discoveryMonthlyCny = discovery.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DISCOVERY);
    const discoveryMonthlyUsd = discovery.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DISCOVERY_USD);
    const discoveryAnnuallyCny = discovery.data.find(({ id }) => id === STRIPE_PRICE_ANNUALLY_DISCOVERY);
    const discoveryAnnuallyUsd = discovery.data.find(({ id }) => id === STRIPE_PRICE_ANNUALLY_DISCOVERY_USD);

    const outreachMonthlyCny = outreach.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_OUTREACH);
    const outreachMonthlyUsd = outreach.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_OUTREACH_USD);
    const outreachAnnuallyCny = outreach.data.find(({ id }) => id === STRIPE_PRICE_ANNUALLY_OUTREACH);
    const outreachAnnuallyUsd = outreach.data.find(({ id }) => id === STRIPE_PRICE_ANNUALLY_OUTREACH_USD);

    if (
        !discoveryMonthlyCny?.unit_amount ||
        !discoveryMonthlyCny?.currency ||
        !discoveryMonthlyCny.product?.metadata.profiles ||
        !discoveryMonthlyCny.product?.metadata.searches ||
        !discoveryMonthlyUsd?.unit_amount ||
        !discoveryMonthlyUsd?.currency ||
        !discoveryMonthlyUsd.product?.metadata.profiles ||
        !discoveryMonthlyUsd.product?.metadata.searches ||
        !discoveryAnnuallyCny?.unit_amount ||
        !discoveryAnnuallyCny?.currency ||
        !discoveryAnnuallyCny.product?.metadata.profiles ||
        !discoveryAnnuallyCny.product?.metadata.searches ||
        !discoveryAnnuallyUsd?.unit_amount ||
        !discoveryAnnuallyUsd?.currency ||
        !discoveryAnnuallyUsd.product?.metadata.profiles ||
        !discoveryAnnuallyUsd.product?.metadata.searches ||
        !outreachMonthlyCny?.unit_amount ||
        !outreachMonthlyCny?.currency ||
        !outreachMonthlyCny.product?.metadata.profiles ||
        !outreachMonthlyCny.product?.metadata.searches ||
        !outreachMonthlyUsd?.unit_amount ||
        !outreachMonthlyUsd?.currency ||
        !outreachMonthlyUsd.product?.metadata.profiles ||
        !outreachMonthlyUsd.product?.metadata.searches ||
        !outreachAnnuallyCny?.unit_amount ||
        !outreachAnnuallyCny?.currency ||
        !outreachAnnuallyCny.product?.metadata.profiles ||
        !outreachAnnuallyCny.product?.metadata.searches ||
        !outreachAnnuallyUsd?.unit_amount ||
        !outreachAnnuallyUsd?.currency ||
        !outreachAnnuallyUsd.product?.metadata.profiles ||
        !outreachAnnuallyUsd.product?.metadata.searches
    ) {
        throw new Error('missing plan information');
    }

    const response: { discovery: NewRelayPlan[]; outreach: NewRelayPlan[] } = {
        discovery: [
            {
                currency: discoveryMonthlyCny.currency,
                prices: {
                    monthly: formatStripePrice(discoveryMonthlyCny.unit_amount),
                    annually: formatStripePrice(discoveryAnnuallyCny.unit_amount),
                },
                profiles: discoveryMonthlyCny.product.metadata.profiles,
                searches: discoveryMonthlyCny.product.metadata.searches,
                priceIds: {
                    monthly: discoveryMonthlyCny.id,
                    annually: discoveryAnnuallyCny.id,
                },
            },
            {
                currency: discoveryMonthlyUsd.currency,
                prices: {
                    monthly: formatStripePrice(discoveryMonthlyUsd.unit_amount),
                    annually: formatStripePrice(discoveryAnnuallyUsd.unit_amount),
                },
                profiles: discoveryMonthlyUsd.product.metadata.profiles,
                searches: discoveryMonthlyUsd.product.metadata.searches,
                priceIds: {
                    monthly: discoveryMonthlyUsd.id,
                    annually: discoveryAnnuallyUsd.id,
                },
            },
        ],
        outreach: [
            {
                currency: outreachMonthlyCny.currency,
                prices: {
                    monthly: formatStripePrice(outreachMonthlyCny.unit_amount),
                    annually: formatStripePrice(outreachAnnuallyCny.unit_amount),
                },
                profiles: outreachMonthlyCny.product.metadata.profiles,
                searches: outreachMonthlyCny.product.metadata.searches,
                priceIds: {
                    monthly: outreachMonthlyCny.id,
                    annually: outreachAnnuallyCny.id,
                },
            },
            {
                currency: outreachMonthlyUsd.currency,
                prices: {
                    monthly: formatStripePrice(outreachMonthlyUsd.unit_amount),
                    annually: formatStripePrice(outreachAnnuallyUsd.unit_amount),
                },
                profiles: outreachMonthlyUsd.product.metadata.profiles,
                searches: outreachMonthlyUsd.product.metadata.searches,
                priceIds: {
                    monthly: outreachMonthlyUsd.id,
                    annually: outreachAnnuallyUsd.id,
                },
            },
        ],
    };
    return response;
};
