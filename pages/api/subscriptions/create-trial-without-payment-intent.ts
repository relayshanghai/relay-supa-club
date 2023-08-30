import type { NextApiRequest, NextApiResponse } from 'next';
import { featNewPricing } from 'src/constants/feature-flags';
import httpCodes from 'src/constants/httpCodes';
import { createSubscriptionErrors } from 'src/errors/subscription';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
    updateCompany,
} from 'src/utils/api/db';
import {
    STRIPE_PRICE_MONTHLY_DISCOVERY,
    STRIPE_PRICE_MONTHLY_DIY,
    STRIPE_PRODUCT_ID_DISCOVERY,
    STRIPE_PRODUCT_ID_DIY,
} from 'src/utils/api/stripe/constants';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { unixEpochToISOString } from 'src/utils/utils';
import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata } from 'types';

export type SubscriptionCreateTrialPostBody = {
    company_id: string;
};

export type SubscriptionCreateTrialResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check the request method
    if (req.method === 'POST') {
        try {
            const { companyId, termsChecked } = req.body;

            if (!companyId) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.missingCompanyData });
            }

            if (!termsChecked) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.termsNotChecked });
            }
            await updateCompany({ id: companyId, terms_accepted: termsChecked });
            const { data, error } = await getCompanyCusId(companyId);
            const cusId = data?.cus_id;
            if (error) throw error;
            if (!cusId) throw new Error('No data');

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
            });
            if (subscriptions.data.length > 0) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.alreadySubscribed });
            }
            const diyPrices = (await stripeClient.prices.list({
                active: true,
                expand: ['data.product'],
                product: STRIPE_PRODUCT_ID_DIY,
            })) as Stripe.ApiList<StripePriceWithProductMetadata>;
            const diyTrialPrice = diyPrices.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DIY);

            const diyTrialPriceId = diyTrialPrice?.id ?? '';
            if (!diyTrialPriceId || !diyTrialPrice) {
                serverLogger(new Error('Missing DIY trial price'), 'error', true);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const discoveryPrices = (await stripeClient.prices.list({
                active: true,
                expand: ['data.product'],
                product: STRIPE_PRODUCT_ID_DISCOVERY,
            })) as Stripe.ApiList<StripePriceWithProductMetadata>;
            const discoveryTrialPrice = discoveryPrices.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DISCOVERY);

            const discoveryTrialPriceId = discoveryTrialPrice?.id ?? '';
            if (!discoveryTrialPriceId || !discoveryTrialPrice) {
                serverLogger(
                    new Error(featNewPricing() ? 'Missing Discovery trial price' : 'Missing DIY trial price'),
                    'error',
                    true,
                );
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const { trial_days, trial_profiles, trial_searches, trial_ai_emails } = featNewPricing()
                ? discoveryTrialPrice.product.metadata
                : diyTrialPrice.product.metadata;

            if (!trial_days || !trial_profiles || !trial_searches || !trial_ai_emails) {
                serverLogger(new Error('Missing product metadata'), 'error', true);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: featNewPricing() ? discoveryTrialPriceId : diyTrialPriceId }],
                proration_behavior: 'create_prorations',
                trial_period_days: Number(trial_days),
            };

            const subscription: SubscriptionCreateTrialResponse = await stripeClient.subscriptions.create(createParams);

            if (!subscription || subscription.status !== 'trialing') {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createSubscriptionErrors.unableToActivateSubscription });
            }

            // free trial follows DIY prices and Discovery prices on new pricing
            const price = (await stripeClient.prices.retrieve(
                featNewPricing() ? discoveryTrialPriceId : diyTrialPriceId,
                {
                    expand: ['product'],
                },
            )) as StripePriceWithProductMetadata;

            const { searches, profiles, ai_emails } = price.product.metadata;
            if (!profiles || !searches || !ai_emails) {
                serverLogger(new Error('Missing metadata'), 'error', true);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            await updateCompanyUsageLimits({
                profiles_limit: profiles,
                searches_limit: searches,
                ai_email_generator_limit: ai_emails,
                trial_profiles_limit: trial_profiles,
                trial_searches_limit: trial_searches,
                trial_ai_email_generator_limit: trial_ai_emails,
                id: companyId,
            });

            const subscription_start_date = unixEpochToISOString(subscription.trial_start, subscription.start_date);
            if (!subscription_start_date) throw new Error('Missing subscription start date');

            await updateCompanySubscriptionStatus({
                subscription_status: 'trial',
                subscription_start_date,
                subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
                subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
                id: companyId,
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error, 'error', true);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
