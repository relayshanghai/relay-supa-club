import type { SetupIntentSucceeded } from 'types/stripe/setup-intent-succeeded-webhook';
import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from './stripe-client';

export const handleSetupIntentSucceeded = async (res: NextApiResponse, setupIntentBody: SetupIntentSucceeded) => {
    const { customer, payment_method: paymentMethod } = setupIntentBody.data.object;
    if (!customer) {
        throw new Error('Missing customer ID in invoice body');
    }

    //attach the payment method to the customer as default payment here
    const updateCustomer = await stripeClient.customers.update(customer, {
        invoice_settings: {
            default_payment_method: paymentMethod,
        },
    });

    // console.log('setupinent_succeeded =========================>', updateCustomer);
    return res.status(httpCodes.OK).json({ updateCustomer });
};
