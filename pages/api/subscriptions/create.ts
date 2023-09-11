import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { getCompanyCusId, updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';
import { unixEpochToISOString } from 'src/utils/utils';
import type Stripe from 'stripe';
import type { RelayPlanStripeProduct } from 'types';

export type SubscriptionCreatePostBody = {
    company_id: string;
    price_id: string;
    coupon_id?: string;
};
export type SubscriptionCreatePostResponse = Stripe.Response<Stripe.Subscription>;
/**
 * Although this is called 'create', it is really 'upgrade' subscription. Only one subscription is allowed per customer and our current signup flow requires all users to start with the free trial subscription. This means that when a user upgrades, we need to cancel the current subscription and create a new one.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, price_id, coupon_id } = req.body as SubscriptionCreatePostBody;
        if (!company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.missingCompanyData });
        if (!price_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.missingPriceId });
        if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({ error: createSubscriptionErrors.actionLimitedToAdmins });
        }
        try {
            const { data: companyData, error: getCompanyError } = await getCompanyCusId(company_id);
            const cusId = companyData?.cus_id;
            if (!companyData || !cusId || getCompanyError) {
                serverLogger(getCompanyError ?? new Error('Missing company data'));
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const paymentMethods = await stripeClient.customers.listPaymentMethods(cusId);
            if (paymentMethods?.data?.length === 0) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.noPaymentMethod });
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
                        .json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
                }
            }
            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
            };
            if (coupon_id) {
                createParams.coupon = coupon_id;
            }

            const subscription: SubscriptionCreatePostResponse = await stripeClient.subscriptions.create(createParams);

            if (subscription.status !== 'active') {
                // not active means the payment was declined.
                await stripeClient.subscriptions.cancel(subscription.id, {});
                return res.status(httpCodes.BAD_REQUEST).json({
                    error: createSubscriptionErrors.unableToActivateSubscription,
                });
            }

            // only cancel old subscription after new one is created successfully
            await stripeClient.subscriptions.cancel(activeSubscription.id, {
                invoice_now: true,
                prorate: true,
            });

            const price = await stripeClient.prices.retrieve(price_id);
            const product = (await stripeClient.products.retrieve(price.product as string)) as RelayPlanStripeProduct;

            const subscription_start_date = unixEpochToISOString(subscription.start_date);
            if (!subscription_start_date) throw new Error('Missing subscription start date');

            const { profiles, searches, ai_emails } = product.metadata;
            if (!profiles || !searches || !ai_emails) {
                serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }));
                throw new Error('Missing product metadata');
            }

            await updateCompanyUsageLimits({
                profiles_limit: profiles,
                searches_limit: searches,
                ai_email_generator_limit: ai_emails,
                id: company_id,
            });

            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
                subscription_start_date,
                subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
                subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
                id: company_id,
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
