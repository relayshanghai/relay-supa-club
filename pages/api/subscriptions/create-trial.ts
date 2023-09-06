import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { updateCompanyUsageLimits, updateCompanySubscriptionStatus } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { unixEpochToISOString } from 'src/utils/utils';
import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata } from 'types';

export interface SubscriptionCreateTrialPostBody {
    customerId: string;
    priceId: string;
    paymentMethodId?: string | null;
    companyId: string;
}
export interface SubscriptionCreateTrialPostResponse {
    subscription: Stripe.Subscription;
}

export type GetSetupIntentQueries = {
    customerId: string;
};
export type GetSetupIntentResponse = {
    clientSecret?: string;
};

const getHandler: NextApiHandler = async (req, res) => {
    const { customerId } = req.query as GetSetupIntentQueries;
    const intent = await stripeClient.setupIntents.create({
        customer: customerId,
        // automatic_payment_methods: { enabled: true }, // by default it is just 'card'. We can enable this to try to allow other payment methods.
        // TODO enable more payment options: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/501
    });
    return res.status(httpCodes.OK).json({ clientSecret: intent.client_secret });
};

const postHandler: NextApiHandler = async (req, res) => {
    const { customerId, priceId, companyId, paymentMethodId } = req.body as SubscriptionCreateTrialPostBody;
    if (!customerId) {
        throw new RelayError('Missing customer ID', httpCodes.BAD_REQUEST);
    }
    if (!priceId) {
        throw new RelayError('Missing price ID', httpCodes.BAD_REQUEST);
    }
    if (!companyId) {
        throw new RelayError('Missing company ID', httpCodes.BAD_REQUEST);
    }

    const subscriptions = await stripeClient.subscriptions.list({
        customer: customerId,
    });
    if (subscriptions.data.length > 0) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.alreadySubscribed });
    }

    const price = (await stripeClient.prices.retrieve(priceId, {
        expand: ['product'],
    })) as Stripe.Response<StripePriceWithProductMetadata>;
    if (!price) {
        throw new RelayError('Failed to retrieve price');
    }
    const { trial_days, trial_profiles, trial_searches, trial_ai_emails, profiles, searches, ai_emails } =
        price.product.metadata;

    if (
        !trial_days ||
        Number.isNaN(Number.parseInt(trial_days)) ||
        !trial_profiles ||
        !trial_searches ||
        !trial_ai_emails ||
        !profiles ||
        !searches ||
        !ai_emails
    ) {
        serverLogger('Missing product metadata: ' + JSON.stringify({ priceId, price }));
        throw new RelayError('Missing product metadata', httpCodes.INTERNAL_SERVER_ERROR, { sendToSentry: true });
    }

    const createParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        default_payment_method: paymentMethodId || undefined,
        proration_behavior: 'create_prorations',
        trial_period_days: Number(trial_days),
    };
    const subscription = await stripeClient.subscriptions.create(createParams);
    if (!subscription || subscription.status !== 'trialing') {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createSubscriptionErrors.unableToActivateSubscription });
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
    const response: SubscriptionCreateTrialPostResponse = {
        subscription,
    };
    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({ postHandler, getHandler });
