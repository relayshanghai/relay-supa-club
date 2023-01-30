import { NextApiRequest, NextApiResponse } from 'next';
import { FREE_TRIAL_DAYS } from 'src/constants/free-trial';
import httpCodes from 'src/constants/httpCodes';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
} from 'src/utils/api/db';
import { STRIPE_PRODUCT_ID_DIY } from 'src/utils/api/stripe/constants';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';
import Stripe from 'stripe';
import { StripePriceWithProductMetadata } from 'types';

export type SubscriptionCreateTrialPostBody = {
    company_id: string;
};
export type SubscriptionCreateTrialResponse = Stripe.Response<Stripe.Subscription>;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id } = JSON.parse(req.body) as SubscriptionCreateTrialPostBody;

        try {
            if (!company_id || typeof company_id !== 'string') {
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
            }
            const { data, error } = await getCompanyCusId(company_id);
            const cusId = data?.cus_id;
            if (error) throw error;
            if (!cusId) throw new Error('No data');

            const paymentMethods = await stripeClient.customers.listPaymentMethods(cusId);
            if (paymentMethods?.data?.length === 0) {
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Missing payment method' });
            }

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            const activeSubscription = subscriptions.data[0];
            if (activeSubscription) {
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Already subscribed' });
            }

            const diyPrices = (await stripeClient.prices.list({
                active: true,
                expand: ['data.product'],
                product: STRIPE_PRODUCT_ID_DIY,
            })) as Stripe.ApiList<StripePriceWithProductMetadata>;

            const diyTrialPrice = diyPrices.data.find(
                ({ recurring }) =>
                    recurring?.interval === 'month' && recurring.interval_count === 1,
            );
            const diyTrialPriceId = diyTrialPrice?.id ?? '';

            if (!diyTrialPriceId)
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Missing DIY trial price' });

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: diyTrialPriceId }],
                proration_behavior: 'create_prorations',
                trial_period_days: FREE_TRIAL_DAYS,
            };

            const subscription = await stripeClient.subscriptions.create(createParams);

            // free trial follows DIY prices
            const price = (await stripeClient.prices.retrieve(diyTrialPriceId, {
                expand: ['product'],
            })) as StripePriceWithProductMetadata;

            if (!price?.product?.metadata?.profiles || !price.product.metadata.searches)
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Missing metadata' });

            await updateCompanyUsageLimits({
                profiles_limit: price.product.metadata.profiles,
                searches_limit: price.product.metadata.searches,
                id: company_id,
            });
            await updateCompanySubscriptionStatus({
                subscription_status: 'trial',
                id: company_id,
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Something went wrong' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
