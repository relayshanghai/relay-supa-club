import { getCompanyByCusId, updateCompanySubscriptionStatus } from '../db';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';

export const handleInvoicePaymentFailed = async (
    req: NextApiRequest,
    res: NextApiResponse,
    invoiceBody: InvoicePaymentFailed,
) => {
    const customerId = invoiceBody.data.object.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }

    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError) {
        serverLogger(companyError, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    await updateCompanySubscriptionStatus({
        subscription_status: 'canceled',
        id: company.id,
    });
    return res.status(httpCodes.NO_CONTENT);
};
