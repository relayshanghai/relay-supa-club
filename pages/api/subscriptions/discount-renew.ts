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

export type SubscriptionDiscountRenewPostBody = {
    company_id: string;
};
export type SubscriptionDiscountRenewPostResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id } = JSON.parse(req.body) as SubscriptionDiscountRenewPostBody;
        if (!company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });

        try {
            const couponParams: Stripe.CouponCreateParams = {
                duration: 'once',
                percent_off: 20,
            };
            const coupon = await stripeClient.coupons.create(couponParams);

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

            const price_id = activeSubscription.items.data[0].price.id;
            if (!price_id) {
                return res
                    .status(httpCodes.FORBIDDEN)
                    .json({ error: 'No active subscription price to upgrade' });
            }

            await stripeClient.subscriptions.cancel(activeSubscription.id, {
                invoice_now: true,
                prorate: true,
            });

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
                coupon: coupon.id,
            };

            const subscription: SubscriptionDiscountRenewPostResponse =
                await stripeClient.subscriptions.create(createParams);

            const price = await stripeClient.prices.retrieve(price_id);
            const product = await stripeClient.products.retrieve(price.product as string);

            await updateCompanyUsageLimits({
                profiles_limit: product.metadata.profiles,
                searches_limit: product.metadata.searches,
                id: company_id,
            });

            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
                subscription_start_date: new Date(
                    subscription.start_date * SECONDS_IN_MILLISECONDS,
                ).toISOString(),
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
