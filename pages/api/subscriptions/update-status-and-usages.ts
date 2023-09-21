import { unixEpochToISOString } from 'src/utils/utils';
import { serverLogger } from 'src/utils/logger-server';
import { ApiHandler } from 'src/utils/api-handler';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { companyId, subscriptionId, priceId } = req.body;

    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
    const price = await stripeClient.prices.retrieve(priceId);
    const product = await stripeClient.products.retrieve(price.product as string);

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
        id: companyId,
    });

    await updateCompanySubscriptionStatus({
        subscription_status: 'active',
        subscription_start_date,
        subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
        subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
        id: companyId,
    });

    return res.status(httpCodes.OK).json('success');
};

export default ApiHandler({
    postHandler,
});
