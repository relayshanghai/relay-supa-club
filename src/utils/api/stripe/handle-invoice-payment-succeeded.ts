import type { NextApiResponse } from 'next';
import type { InvoicePaymentSucceeded } from 'types/stripe/invoice-payment-succeeded-webhook';
import { getCompanyByCusId } from '../db';
import updateSubscriptionUsagesAndStatus from '../update-subscription-usage-status';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

export const handleInvoicePaymentSucceeded = async (res: NextApiResponse, invoiceBody: InvoicePaymentSucceeded) => {
    //when receive this webhook, update the company with its companyId, subscriptionId and priceId
    const customerId = invoiceBody.data.object.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }
    const { data, error } = await getCompanyByCusId(customerId);

    if (error || !data?.id) {
        throw new Error(error?.message || 'Unable to find company by customer ID');
    }
    const companyId = data.id;
    if (!companyId) {
        throw new Error('Missing company ID in invoice body');
    }
    const subscriptionId = invoiceBody.data.object.lines.data[0].subscription;
    if (!subscriptionId) {
        throw new Error('Missing subscription ID in invoice body');
    }
    const priceId = invoiceBody.data.object.lines.data[0].price.id;
    if (!priceId) {
        throw new Error('Missing price ID in invoice body');
    }

    try {
        await updateSubscriptionUsagesAndStatus(companyId, subscriptionId, priceId);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: error });
    }
    return res.status(httpCodes.OK).json({ message: 'success' });
};
