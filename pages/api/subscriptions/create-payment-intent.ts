import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';

export const getHandler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST')
        try {
            const paymentIntent = await stripeClient.paymentIntents.create({
                amount: 299,
                currency: 'cny',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (err) {
            serverLogger(err, 'error', true);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'unable to create payment intent' });
        }
};
