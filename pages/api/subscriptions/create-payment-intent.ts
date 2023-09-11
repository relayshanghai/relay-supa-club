import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';

export type CreatePaymentIntentPostBody = {
    amount: number;
    currency: string;
    customer: string;
};
const getHandler: NextApiHandler = async (req, res) => {
    const { amount, currency, customer } = req.body as CreatePaymentIntentPostBody;

    if (req.method === 'POST')
        try {
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
        } catch (err) {
            serverLogger(err);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'unable to create payment intent' });
        }
};

export default getHandler;
