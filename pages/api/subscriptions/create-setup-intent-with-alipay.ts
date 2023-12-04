import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { getHostnameFromRequest } from 'src/utils/get-host';

export type CreateSetUpIntentPostBody = {
    customerId: string;
    paymentMethodTypes: string[];
    priceId: string;
    companyId: string;
    currency: string;
    priceTier: string;
};
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { companyId, customerId, paymentMethodTypes, priceId, currency, priceTier } = req.body;
    //create an payment method to confirm the setup intent
    const paymentMethod = await stripeClient.paymentMethods.create({
        type: 'alipay',
    });
    if (!paymentMethod) {
        serverLogger('Failed to create payment method');
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Failed to create payment method' });
    }
    //attach payment method to customer
    const paymentMethodAttach = await stripeClient.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
    });

    if (!paymentMethodAttach) {
        serverLogger('Failed to attach payment method to customer');
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Failed to attach payment method to customer' });
    }
    const { appUrl } = getHostnameFromRequest(req);
    const returnUrlParams = new URLSearchParams();
    returnUrlParams.append('customerId', customerId);
    returnUrlParams.append('priceId', priceId);
    returnUrlParams.append('companyId', companyId);
    returnUrlParams.append('selectedPlan', priceTier);
    //create a setup intent
    const response = await stripeClient.setupIntents.create(
        {
            customer: customerId,
            payment_method_types: paymentMethodTypes,
            confirm: true,
            payment_method: paymentMethod.id,
            payment_method_options: {
                //@ts-ignore the alipay is not added to Stripe.PaymentMethodOptions but it should be according to the doc https://stripe.com/docs/billing/subscriptions/alipay#create-setup-intent
                alipay: {
                    currency,
                },
            },
            usage: 'off_session',
            mandate_data: {
                customer_acceptance: {
                    type: 'online',
                    online: {
                        ip_address: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
                        user_agent: req.headers['user-agent'] ?? 'Unknown user-agent',
                    },
                },
            },
            return_url: `${appUrl}/payments/confirm-alipay?${returnUrlParams}`,
        },
        undefined,
    );
    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
