import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';

export interface CouponGetQueries {
    coupon_id: string;
}
export type CouponGetResponse = Stripe.Response<Stripe.Coupon>;
const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
    }
    const { coupon_id } = req.query as unknown as CouponGetQueries;
    if (!coupon_id) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing coupon_id' });
    }
    const coupon = await stripeClient.coupons.retrieve(coupon_id);
    if (!coupon?.id) {
        return res.status(httpCodes.NOT_FOUND).json({ error: 'Coupon not found' });
    }
    return res.status(httpCodes.OK).json(coupon);
};
export default handler;
