import { getCompanyByCusId, supabaseLogger, updateCompanySubscriptionStatus } from '../db';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

import type { NextApiResponse } from 'next';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { RELAY_DOMAIN } from 'src/constants';

export const handleInvoicePaymentFailed = async (res: NextApiResponse, invoiceBody: InvoicePaymentFailed) => {
    const customerId = invoiceBody.data.object.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }

    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError) {
        serverLogger(companyError);
        await supabaseLogger({
            type: 'stripe-webhook',
            message: 'Error getting company by customer ID',
        });
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    if (company.name === RELAY_DOMAIN) {
        await supabaseLogger({
            type: 'stripe-webhook',
            message: 'Payment failed for Relay domain, no need to cancel subscription',
        });
        // no need to cancel the subscription for our internal employees company
        return res.status(httpCodes.NO_CONTENT);
    }

    await updateCompanySubscriptionStatus({
        subscription_status: 'canceled',
        id: company.id,
    });
    await supabaseLogger({
        type: 'stripe-webhook',
        message: `Updated company subscription status to canceled, company ID: ${company.id}`,
    });
    return res.status(httpCodes.NO_CONTENT);
};
