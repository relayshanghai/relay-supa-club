import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import { APP_URL } from 'src/constants';
import { serverLogger } from 'src/utils/logger-server';

export type CreateSetUpIntentPostBody = {
    customerId: string;
    paymentMethodTypes: string[];
    priceId: string;
    companyId: string;
};
// this is actually create setup intent with alipay as payment method, not a generic create setup intent
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { companyId, customerId, paymentMethodTypes, priceId } = req.body;
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
    const returnUrlParams = new URLSearchParams();
    returnUrlParams.append('customerId', customerId);
    returnUrlParams.append('priceId', priceId);
    returnUrlParams.append('companyId', companyId);

    //create a setup intent
    const response = await stripeClient.setupIntents.create({
        // this create setupIntent works although the stripe doc says it's not supported..
        //https://stripe.com/docs/billing/subscriptions/alipay#create-setup-intent
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        // confirm: true,
        // payment_method: paymentMethod.id,
        // payment_method_options: {
        //     alipay: {
        //         currency: 'cny',
        //     },
        // },
        // usage: 'off_session',
        // mandate_data: {
        //     customer_acceptance: {
        //         type: 'online',
        //         online: {
        //             ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        //             user_agent: req.headers['user-agent'],
        //         },
        //     },
        // },
        // return_url: `${APP_URL}/payments/confirm-alipay?${returnUrlParams}`,
    });

    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
