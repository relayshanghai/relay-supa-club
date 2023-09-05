import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

export type CreatePaymentIntentPostBody = {
    amount: number;
    currency: string;
    customer: string;
};
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { amount, currency, customer } = req.body as CreatePaymentIntentPostBody;

    const paymentIntent = await stripeClient.paymentIntents.create({
        customer,
        amount,
        currency,
        setup_future_usage: 'off_session', //enable this parameter will attach payment method to customer
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });

    return res.status(httpCodes.OK).json(paymentIntent);
};

export default ApiHandler({
    postHandler,
});
