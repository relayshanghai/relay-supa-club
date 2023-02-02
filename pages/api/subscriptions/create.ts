import { NextApiRequest, NextApiResponse } from 'next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import httpCodes from 'src/constants/httpCodes';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
} from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';
import Stripe from 'stripe';

export type SubscriptionCreatePostBody = {
    company_id: string;
    price_id: string;
};
export type SubscriptionCreatePostResponse = Stripe.Response<Stripe.Subscription>;
/**
 * Although this is called 'create', it is really 'upgrade' subscription. Only one subscription is allowed per customer and our current signup flow requires all users to start with the free trial subscription. This means that when a user upgrades, we need to cancel the current subscription and create a new one.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, price_id } = JSON.parse(req.body) as SubscriptionCreatePostBody;
        if (!company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
        if (!price_id) return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing price id' });

        try {
            const { data: companyData } = await getCompanyCusId(company_id);
            const cusId = companyData?.cus_id;
            if (!companyData || !cusId) {
                serverLogger(new Error('Missing company data'), 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const paymentMethods = await stripeClient.customers.listPaymentMethods(cusId);
            if (paymentMethods?.data?.length === 0) {
                serverLogger(new Error('Missing payment method'), 'error');

                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            let activeSubscription = subscriptions.data[0];

            if (!activeSubscription) {
                const trialSubscriptions = await stripeClient.subscriptions.list({
                    customer: cusId,
                    status: 'trialing',
                });
                activeSubscription = trialSubscriptions.data[0];
                if (!activeSubscription) {
                    return res
                        .status(httpCodes.FORBIDDEN)
                        .json({ error: 'No active subscription to upgrade' });
                }
            }

            await stripeClient.subscriptions.cancel(activeSubscription.id, {
                invoice_now: true,
                prorate: true,
            });

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
            };

            const subscription: SubscriptionCreatePostResponse =
                await stripeClient.subscriptions.create(createParams);

            const price = await stripeClient.prices.retrieve(price_id);
            const product = await stripeClient.products.retrieve(price.product as string);

            const subscription_start_date = subscription.start_date
                ? new Date(subscription.start_date * SECONDS_IN_MILLISECONDS).toISOString()
                : undefined;
            if (!subscription_start_date) throw new Error('Missing subscription start date');

            const subscription_current_period_start = subscription.current_period_start
                ? new Date(
                      subscription.current_period_start * SECONDS_IN_MILLISECONDS,
                  ).toISOString()
                : undefined;
            const subscription_current_period_end = subscription.current_period_end
                ? new Date(subscription.current_period_end * SECONDS_IN_MILLISECONDS).toISOString()
                : undefined;

            await updateCompanyUsageLimits({
                profiles_limit: product.metadata.profiles,
                searches_limit: product.metadata.searches,
                id: company_id,
            });

            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
                subscription_start_date,
                subscription_current_period_start,
                subscription_current_period_end,
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
