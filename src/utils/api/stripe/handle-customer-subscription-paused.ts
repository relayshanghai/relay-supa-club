import type { NextApiResponse } from 'next';
import type { CustomerSubscriptionPaused } from 'types/stripe/customer-subscription-paused-webhook';
import { getCompanyByCusId, updateCompanySubscriptionStatus } from '../db';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

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
