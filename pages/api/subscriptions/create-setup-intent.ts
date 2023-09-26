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
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        // confirm: true,
        // mandate_data: {
        //     customer_acceptance: {
        //         type: 'online',
        //   online: {
        //     ip_address: req.headers['x-real-ip'],
        //     user_agent: req.headers['user-agent'],
        //   },
        //       },
        // },
    });
    console.log('setupIntent =========>', setupIntent);
    const confirmSetupIntent = await stripeClient.setupIntents.confirm(setupIntent.id);
    console.log('confirmSetupIntent =========>', confirmSetupIntent);
    res.status(httpCodes.OK).json({ setupIntent });
};

export default ApiHandler({
    postHandler,
});
