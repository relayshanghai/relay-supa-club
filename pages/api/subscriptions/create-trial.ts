import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import {
    AI_EMAIL_SUBSCRIPTION_USAGE_LIMIT,
    AI_EMAIL_TRIAL_USAGE_LIMIT,
} from 'src/constants/openai';
import { createSubscriptionErrors } from 'src/errors/subscription';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
} from 'src/utils/api/db';
import { STRIPE_PRICE_MONTHLY_DIY, STRIPE_PRODUCT_ID_DIY } from 'src/utils/api/stripe/constants';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { unixEpochToISOString } from 'src/utils/utils';
import Stripe from 'stripe';
import { StripePriceWithProductMetadata } from 'types';

export type SubscriptionCreateTrialPostBody = {
    company_id: string;
};

export type SubscriptionCreateTrialResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { company_id } = JSON.parse(req.body) as SubscriptionCreateTrialPostBody;

            if (!company_id || typeof company_id !== 'string') {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createSubscriptionErrors.missingCompanyData });
            }
            if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
                return res
                    .status(httpCodes.UNAUTHORIZED)
                    .json({ error: createSubscriptionErrors.actionLimitedToAdmins });
            }
            const { data, error } = await getCompanyCusId(company_id);
            const cusId = data?.cus_id;
            if (error) throw error;
            if (!cusId) throw new Error('No data');

            const paymentMethods = await stripeClient.customers.listPaymentMethods(cusId);
            if (paymentMethods?.data?.length === 0) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing payment method' });
            }

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            const activeSubscription = subscriptions.data[0];
            if (activeSubscription) {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createSubscriptionErrors.alreadySubscribed });
            }
            const diyPrices = (await stripeClient.prices.list({
                active: true,
                expand: ['data.product'],
                product: STRIPE_PRODUCT_ID_DIY,
            })) as Stripe.ApiList<StripePriceWithProductMetadata>;
            const diyTrialPrice = diyPrices.data.find(({ id }) => id === STRIPE_PRICE_MONTHLY_DIY);

            const diyTrialPriceId = diyTrialPrice?.id ?? '';
            if (!diyTrialPriceId || !diyTrialPrice) {
                serverLogger(new Error('Missing DIY trial price'), 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const { trial_days, trial_profiles, trial_searches } = diyTrialPrice.product.metadata;

            if (!trial_days || !trial_profiles || !trial_searches) {
                serverLogger(new Error('Missing product metadata'), 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: diyTrialPriceId }],
                proration_behavior: 'create_prorations',
                trial_period_days: Number(trial_days),
            };

            const subscription: SubscriptionCreateTrialResponse =
                await stripeClient.subscriptions.create(createParams);

            if (!subscription || subscription.status !== 'trialing') {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createSubscriptionErrors.unableToActivateSubscription });
            }

            // free trial follows DIY prices
            const price = (await stripeClient.prices.retrieve(diyTrialPriceId, {
                expand: ['product'],
            })) as StripePriceWithProductMetadata;

            if (!price?.product?.metadata?.profiles || !price.product.metadata.searches) {
                serverLogger(new Error('Missing metadata'), 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            await updateCompanyUsageLimits({
                profiles_limit: price.product.metadata.profiles,
                searches_limit: price.product.metadata.searches,
                ai_email_generator_limit: AI_EMAIL_SUBSCRIPTION_USAGE_LIMIT,
                trial_profiles_limit: trial_profiles,
                trial_searches_limit: trial_searches,
                trial_ai_email_generator_limit: AI_EMAIL_TRIAL_USAGE_LIMIT,
                id: company_id,
            });

            const subscription_start_date = unixEpochToISOString(
                subscription.trial_start,
                subscription.start_date,
            );
            if (!subscription_start_date) throw new Error('Missing subscription start date');

            await updateCompanySubscriptionStatus({
                subscription_status: 'trial',
                subscription_start_date,
                subscription_current_period_start: unixEpochToISOString(
                    subscription.current_period_start,
                ),
                subscription_current_period_end: unixEpochToISOString(
                    subscription.current_period_end,
                ),
                id: company_id,
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
