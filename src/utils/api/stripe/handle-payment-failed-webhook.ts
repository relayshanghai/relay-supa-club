import { getCompanyByCusId, updateCompanySubscriptionStatus } from '../db';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

import type { NextApiResponse } from 'next';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { LEGACY_RELAY_DOMAIN } from 'src/constants';
import { rudderstack, track } from 'src/utils/rudderstack/rudderstack';
import type { StripeWebhookPaymentFailedPayload } from 'src/utils/analytics/events/stripe/stripe-webhook-payment-failed';
import { StripeWebhookPaymentFailed } from 'src/utils/analytics/events/stripe/stripe-webhook-payment-failed';

export const handleInvoicePaymentFailed = async (res: NextApiResponse, invoiceBody: InvoicePaymentFailed) => {
    const trackingData: StripeWebhookPaymentFailedPayload = {
        type: 'invoice.payment_failed',
        is_success: false,
        extra_info: { event: invoiceBody, error: null, company: null, updated_subscription: null },
    };
    const tracker = track(rudderstack.getClient(), rudderstack.getIdentity());
    tracker(StripeWebhookPaymentFailed, trackingData);

    const customerId = invoiceBody.data.object.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }

    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    trackingData.extra_info.company = company;
    if (companyError) {
        trackingData.extra_info.error = companyError;
        serverLogger(companyError);
        tracker(StripeWebhookPaymentFailed, trackingData);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: companyError.message });
    }

    // no need to cancel the subscription for our internal employees company
    if (company.name === LEGACY_RELAY_DOMAIN) {
        trackingData.extra_info.error = 'No need to cancel the subscription for our internal employees company';
        tracker(StripeWebhookPaymentFailed, trackingData);
        return res.status(httpCodes.NO_CONTENT);
    }

    try {
        const update = await updateCompanySubscriptionStatus({
            subscription_status: 'canceled',
            id: company.id,
        });
        trackingData.extra_info.updated_subscription = update;
        trackingData.is_success = true;
    } catch (error: any) {
        trackingData.extra_info.error = `updateCompanySubscriptionStatus error: ${error.message} \n stack${error?.stack}`;
        tracker(StripeWebhookPaymentFailed, trackingData);
        return res.status(httpCodes.NO_CONTENT).json({ message: error.message });
    }

    tracker(StripeWebhookPaymentFailed, trackingData);
    return res.status(httpCodes.OK).json({ message: 'success' });
};
