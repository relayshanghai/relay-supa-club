import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';

export type CreateSetUpIntentPostBody = {
    customerId: string;
    paymentMethodTypes: string[];
};
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { customerId, paymentMethodTypes } = req.body;
    const setupIntent = await stripeClient.setupIntents.create({
        automatic_payment_methods: { enabled: true },
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        usage: 'off_session',
        confirm: true,
        // mandate_data: {
        //     customer_acceptance: {
        //         type: 'online',
        //         online: {
        //             ip_address: req.socket.remoteAddress,
        //             user_agent: req.headers['user-agent'],
        //         },
        //     },
        // }
        // return_url: 'http://localhost:3000/payment/alipay',
    });

    res.status(httpCodes.OK).json({ setupIntent });
};

export default ApiHandler({
    postHandler,
});
