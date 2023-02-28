import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { AI_EMAIL_SUBSCRIPTION_USAGE_LIMIT } from 'src/constants/openai';
import { createSubscriptionErrors } from 'src/errors/subscription';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
} from 'src/utils/api/db';
import { getSubscription } from 'src/utils/api/stripe/helpers';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { unixEpochToISOString } from 'src/utils/utils';
import Stripe from 'stripe';

export type SubscriptionDiscountRenewPostBody = {
    company_id: string;
};
export type SubscriptionDiscountRenewPostResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id } = req.body as SubscriptionDiscountRenewPostBody;
        if (!company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
        if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
            return res
                .status(httpCodes.UNAUTHORIZED)
                .json({ error: 'This action is limited to company admins' });
        }
        try {
            const couponParams: Stripe.CouponCreateParams = {
                duration: 'once',
                percent_off: 20,
            };
            const coupon = await stripeClient.coupons.create(couponParams);

            const { data: companyData } = await getCompanyCusId(company_id);
            const cusId = companyData?.cus_id;
            if (!companyData || !cusId) {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createSubscriptionErrors.missingCompanyData });
            }

            const activeSubscription = await getSubscription(company_id);
            if (!activeSubscription) {
                return res
                    .status(httpCodes.FORBIDDEN)
                    .json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
            }

            const price_id = activeSubscription.items.data[0].price.id;
            if (!price_id) {
                return res
                    .status(httpCodes.FORBIDDEN)
                    .json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
            }

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
                coupon: coupon.id,
            };

            const subscription: SubscriptionDiscountRenewPostResponse =
                await stripeClient.subscriptions.create(createParams);

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
            const product = await stripeClient.products.retrieve(price.product as string);

            const subscription_start_date = unixEpochToISOString(subscription.start_date);
            if (!subscription_start_date) throw new Error('Missing subscription start date');

            await updateCompanyUsageLimits({
                profiles_limit: product.metadata.profiles,
                searches_limit: product.metadata.searches,
                ai_email_generator_limit: AI_EMAIL_SUBSCRIPTION_USAGE_LIMIT,
                id: company_id,
            });

            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
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
