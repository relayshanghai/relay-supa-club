import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { unixEpochToISOString } from '../utils';
import { serverLogger } from '../logger-server';
import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from './db';
import { transformStripeStatus } from './stripe/helpers';
import type { SubscriptionPlans } from 'types/appTypes';

const updateSubscriptionUsagesAndStatus = async (companyId: string, subscriptionId: string, priceId: string) => {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
    const price = await stripeClient.prices.retrieve(priceId);
    const product = await stripeClient.products.retrieve(price.product as string);

    const subscription_start_date = unixEpochToISOString(subscription.start_date);
    if (!subscription_start_date) throw new Error('Missing subscription start date');

    const { profiles, searches } = product.metadata;
    if (!profiles || !searches) {
        serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }));
        throw new Error('Missing product metadata');
    }
    //the subscription plan are from Stripe Product, some of the old plans should be archived when all user data is migrated to the new plans
    const stripePlans = ['Discovery', 'Outreach', 'Company Demo', 'DIY', 'DIY Max', 'VIP', 'Discovery(deprecated)'];
    if (!stripePlans.includes(product.name)) {
        throw new Error(`Invalid subscription plan: ${product.name}`);
    }

    const subscriptionPlan = product.name as SubscriptionPlans;

    await updateCompanyUsageLimits({
        profiles_limit: profiles,
        searches_limit: searches,
        id: companyId,
    });

    await updateCompanySubscriptionStatus({
        subscription_status: transformStripeStatus(subscription.status),
        subscription_start_date,
        subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
        subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
        id: companyId,
        subscription_plan: subscriptionPlan,
        subscription_end_date: null, //reset subscription_end_date to null when upgrade a subscription from canceled to active
    });
};

export default updateSubscriptionUsagesAndStatus;
