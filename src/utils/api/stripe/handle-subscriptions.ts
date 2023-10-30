import type {
    SubscriptionCancelPostRequestBody,
    SubscriptionCancelPostResponseBody,
} from 'pages/api/subscriptions/cancel-with-subscription-id';
import type {
    SubscriptionUpgradePostRequestBody,
    SubscriptionUpgradePostResponse,
} from 'pages/api/subscriptions/create-subscription-with-payment-intent';
import { nextFetch } from 'src/utils/fetcher';
import type { NextApiResponse } from 'next';
import type { CustomerSubscriptionPaused } from 'types/stripe/customer-subscription-paused-wenhook';
import { getCompanyByCusId, updateCompanySubscriptionStatus } from '../db';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

export const upgradeSubscriptionWithPaymentIntent = async (
    companyId: string,
    cusId: string,
    priceId: string,
    couponId?: string,
) => {
    const body: SubscriptionUpgradePostRequestBody = {
        companyId,
        cusId,
        priceId,
        couponId,
    };
    const res = await nextFetch<SubscriptionUpgradePostResponse>(
        'subscriptions/create-subscription-with-payment-intent',
        {
            method: 'post',
            body: JSON.stringify(body),
        },
    );
    return res;
};

export const cancelSubscriptionWithSubscriptionId = async (subscriptionId: string) => {
    const body: SubscriptionCancelPostRequestBody = {
        subscriptionId,
    };
    const res = await nextFetch<SubscriptionCancelPostResponseBody>('subscriptions/cancel-with-subscription-id', {
        method: 'post',
        body: JSON.stringify(body),
    });
    return res;
};

export const handleCustomerSubscriptionPaused = async (res: NextApiResponse, event: CustomerSubscriptionPaused) => {
    const customerId = event.data?.object?.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }
    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError || !company?.id) {
        throw new Error(companyError?.message || 'Unable to find company by customer ID');
    }
    const companyId = company.id;

    try {
        // update company subscription status to paused
        await updateCompanySubscriptionStatus({
            subscription_status: 'paused',
            id: companyId,
        });
    } catch (error) {
        serverLogger(error);
        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Cannot update subscription status to paused' });
    }

    return res.status(httpCodes.OK).json({ message: 'success' });
};
