import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { ApiHandler } from 'src/utils/api-handler';
import { getCompanyCusId, updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import { getSubscription } from 'src/utils/api/stripe/helpers';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';
import { unixEpochToISOString } from 'src/utils/utils';
import type Stripe from 'stripe';
import type { RelayPlanStripeProduct } from 'types';

export type SubscriptionDiscountRenewPostBody = {
    company_id: string;
};
export type SubscriptionDiscountRenewPostResponse = Stripe.Response<Stripe.Subscription>;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { company_id } = req.body as SubscriptionDiscountRenewPostBody;
    if (!company_id) return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
    if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
    }
    const couponParams: Stripe.CouponCreateParams = {
        duration: 'once',
        percent_off: 20,
    };
    const coupon = await stripeClient.coupons.create(couponParams);

    const { data: companyData } = await getCompanyCusId(company_id);
    const cusId = companyData?.cus_id;
    if (!companyData || !cusId) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.missingCompanyData });
    }

    const activeSubscription = await getSubscription(company_id);
    if (!activeSubscription) {
        return res.status(httpCodes.FORBIDDEN).json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
    }

    const price_id = activeSubscription.items.data[0].price.id;
    if (!price_id) {
        return res.status(httpCodes.FORBIDDEN).json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
    }

    const createParams: Stripe.SubscriptionCreateParams = {
        customer: cusId,
        items: [{ price: price_id }],
        proration_behavior: 'create_prorations',
        coupon: coupon.id,
    };

    const subscription: SubscriptionDiscountRenewPostResponse = await stripeClient.subscriptions.create(createParams);

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
    const { profiles, searches } = product.metadata;
    if (!profiles || !searches) {
        serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }));
        throw new Error('Missing product metadata');
    }
    await updateCompanyUsageLimits({
        profiles_limit: profiles,
        searches_limit: searches,
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
}

export default ApiHandler({
    postHandler,
});
