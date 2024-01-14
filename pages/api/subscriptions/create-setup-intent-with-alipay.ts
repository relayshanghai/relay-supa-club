import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import httpCodes from 'src/constants/httpCodes';
import type Stripe from 'stripe';
import SubscriptionService from 'src/backend/domain/subscription/subscription';

export type CreateSetUpIntentForAlipayPostBody = {
    paymentMethodTypes: string[];
    priceId: string;
    currency: string;
    priceTier: string;
    couponId?: string;
    paymentMethodId?: string;
};

export type CreateSetUpIntentForAlipayPostResponse = Stripe.SetupIntent;

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { priceId, currency, priceTier, couponId, paymentMethodId } = req.body as CreateSetUpIntentForAlipayPostBody;
    const response = await SubscriptionService.getService().setupIntent(
        'alipay',
        priceId,
        currency,
        priceTier,
        couponId,
        paymentMethodId,
    );
    return res.status(httpCodes.OK).json(response);
};

export default ApiHandlerWithContext({
    postHandler,
});
