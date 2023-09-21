import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { PaymentIntentSucceeded } from 'types/stripe/payment-intent-succeeded-webhook';

export const handlePaymentIntentSucceeded = async (res: NextApiResponse, event: PaymentIntentSucceeded) => {
    const paymentIntent = event.data.object;
    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError) {
        serverLogger(companyError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: companyError.message });
    }
    try {
    } catch (error) {
        const update = await updateCompanySubscriptionStatus({
            subscription_status: 'active',
            id: company.id,
        });
    }
};
