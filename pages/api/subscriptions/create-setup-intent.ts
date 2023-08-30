import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';

export type CreateSetupIntentPostBody = {
    customer: string;
    paymentMethodTypes?: string[];
};
const getHandler: NextApiHandler = async (req, res) => {
    const { customer, paymentMethodTypes } = req.body as CreateSetupIntentPostBody;
    if (req.method === 'POST')
        try {
            const setupIntent = await stripeClient.setupIntents.create({
                customer,
                payment_method_types: paymentMethodTypes,
                usage: 'off_session',

                // mandate_data: {
                //     customer_acceptance: {
                //         type: 'online',
                //         online: {
                //             ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                //             user_agent: req.headers['user-agent'],
                //         },
                //     },
                // },
                // next_action
            });
            res.send({
                clientSecret: setupIntent.client_secret,
            });
        } catch (err) {
            serverLogger(err, 'error', true);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'unable to create setup intent' });
        }
};

export default getHandler;
