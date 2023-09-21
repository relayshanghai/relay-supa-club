import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import type Stripe from 'stripe';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

export type SubscriptionUpgradePostRequestBody = {
    companyId: string;
    cusId: string;
    priceId: string;
    couponId?: string;
};

export interface SubscriptionUpgradePostResponse extends Stripe.Response<Stripe.Subscription> {
    type: Stripe.Subscription.Status;
    clientSecret: string;
    subscriptionId: string;
    oldSubscriptionId: string;
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { cusId, priceId } = req.body as SubscriptionUpgradePostRequestBody;

    const oldSubscription = await stripeClient.subscriptions.list({
        customer: cusId,
    });
    console.log('subscriptions ===============>', oldSubscription);
    if (oldSubscription.data.length > 1) {
        serverLogger('More than one subscription found for customer: ' + cusId);
    }
    const oldSubscriptionId = oldSubscription.data[0].id;
    console.log('subscriptions ===============>', oldSubscriptionId);

    const subscription = await stripeClient.subscriptions.create({
        customer: cusId,
        payment_behavior: 'default_incomplete',
        items: [{ price: priceId }],
        payment_settings: { save_default_payment_method: 'on_subscription' },
        proration_behavior: 'create_prorations',
        expand: ['latest_invoice.payment_intent'],
    });

    const payment_intent = (subscription.latest_invoice as Stripe.Invoice).payment_intent;
    res.send({
        type: 'payment',
        clientSecret: (payment_intent as Stripe.PaymentIntent).client_secret,
        subscriptionId: subscription.id,
        oldSubscriptionId,
    });

    // only cancel old subscription after new one is created successfully
    // await stripeClient.subscriptions.cancel(activeSubscription.id, {
    //     invoice_now: true,
    //     prorate: true,
    // });

    //code from create.ts to update company usage limits and subscription status in db
    // const price = await stripeClient.prices.retrieve(priceId);
    // const product = (await stripeClient.products.retrieve(
    //     price.product as string,
    // )) as RelayPlanStripeProduct;

    // const subscription_start_date = unixEpochToISOString(subscription.start_date);
    // if (!subscription_start_date) throw new Error('Missing subscription start date');

    // const { profiles, searches, ai_emails } = product.metadata;
    // if (!profiles || !searches || !ai_emails) {
    //     serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }));
    //     throw new Error('Missing product metadata');
    // }

    // await updateCompanyUsageLimits({
    //     profiles_limit: profiles,
    //     searches_limit: searches,
    //     ai_email_generator_limit: ai_emails,
    //     id: companyId,
    // });

    // await updateCompanySubscriptionStatus({
    //     subscription_status: 'active',
    //     subscription_start_date,
    //     subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
    //     subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
    //     id: companyId,
    // });
    return res.status(httpCodes.OK).json(subscription);
};

export default ApiHandler({
    postHandler,
});
