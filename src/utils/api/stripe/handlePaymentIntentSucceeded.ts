import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { PaymentIntentSucceeded } from 'types/stripe/payment-intent-succeeded-webhook';
import { getCompanyByCusId, updateCompanySubscriptionStatus } from '../db';

export const handlePaymentIntentSucceeded = async (res: NextApiResponse, event: PaymentIntentSucceeded) => {
    const paymentIntent = event.data.object;
    const customerId = paymentIntent.customer;
    if (!customerId) {
        serverLogger('Missing customer ID in invoice body');
        return res.status(httpCodes.BAD_REQUEST).json('Missing customer ID in invoice body');
    }
    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError) {
        serverLogger(companyError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: companyError.message });
    }
    try {
        await updateCompanySubscriptionStatus({
            subscription_status: 'active',
            id: company.id,
        });
    } catch (error: any) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
    return res.status(httpCodes.OK).json('success');
};
