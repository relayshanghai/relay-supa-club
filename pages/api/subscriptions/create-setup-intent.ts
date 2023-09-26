import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import { APP_URL } from 'src/constants';

export type CreateSetUpIntentPostBody = {
    customerId: string;
    paymentMethodTypes: string[];
};
const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { customerId, paymentMethodTypes } = req.body;
    //create an payment method to confirm the setup intent
    const paymentMethod = await stripeClient.paymentMethods.create({
        type: 'alipay',
    });
    console.log('paymentMethod ====================>', paymentMethod);
    //attach payment method to customer
    const paymentMethodAttach = await stripeClient.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
    });
    console.log('paymentMethodAttach ====================>', paymentMethodAttach);
    //create a setup intent
    const setupIntent = await stripeClient.setupIntents.create({
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        confirm: true,
        payment_method: paymentMethod.id,
        payment_method_options: {
            alipay: {
                currency: 'cny',
            },
        },
        usage: 'off_session',
        mandate_data: {
            customer_acceptance: {
                type: 'online',
                online: {
                    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    user_agent: req.headers['user-agent'],
                },
            },
        },
        return_url: `${APP_URL}/payments/confirm-alipay`,
    });
    console.log('setupIntent ====================>', setupIntent);

    //confirm the setup intent with payment method
    // const confirmSetupIntent = await stripeClient.setupIntents.confirm(setupIntent.id, {
    //     payment_method: paymentMethod.id,
    // });
    // console.log('confirmSetupIntent ====================>', confirmSetupIntent);
    res.status(httpCodes.OK).json({ setupIntent });
};

export default ApiHandler({
    postHandler,
});
