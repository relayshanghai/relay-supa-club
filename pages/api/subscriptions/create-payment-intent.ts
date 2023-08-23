import type { NextApiHandler } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

export const getHandler: NextApiHandler = async (req, res) => {
    // const { items } = req.body;
    //create a PaymentIntent with the priceId and currency
    const paymentIntent = await stripeClient.paymentIntents.create({
        amount: 1000,
        currency: 'cny',
        metadata: { integration_check: 'accept_a_payment' },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
};
