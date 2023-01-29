import { NextApiRequest, NextApiResponse } from 'next';
import {
    getCompanyCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
} from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';
import Stripe from 'stripe';

export type SubscriptionCreatePostBody = {
    company_id: string;
    // send price id if upgrading, don't send if creating free trial
    price_id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, price_id } = JSON.parse(req.body) as SubscriptionCreatePostBody;
        if (!company_id) return res.status(500).json({ error: 'Missing company id' });
        if (!price_id) return res.status(500).json({ error: 'Missing price id' });
        try {
            const { data: companyData } = await getCompanyCusId(company_id);
            const cusId = companyData?.cus_id;
            if (!companyData || !cusId) {
                return res.status(500).json({ error: 'Missing company data' });
            }

            const paymentMethods = await stripeClient.customers.listPaymentMethods(cusId);
            if (paymentMethods?.data?.length === 0) {
                return res.status(500).json({ error: 'Missing payment method' });
            }

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            const activeSubscription = subscriptions.data[0];

            // All users should be starting with the free trial subscription
            if (!activeSubscription) {
                return res.status(500).json({ error: 'No active subscription' });
            }

            await stripeClient.subscriptions.cancel(activeSubscription.id, {
                invoice_now: true,
                prorate: true,
            });

            const createParams: Stripe.SubscriptionCreateParams = {
                customer: cusId,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
            };

            const subscription = await stripeClient.subscriptions.create(createParams);

            const price = await stripeClient.prices.retrieve(price_id);
            const product = await stripeClient.products.retrieve(price.product as string);

            await updateCompanyUsageLimits({
                profiles_limit: product.metadata.profiles,
                searches_limit: product.metadata.searches,
                id: company_id,
            });
            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
                id: company_id,
            });

            return res.status(200).json(subscription);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(500).json({ error: 'unable to create subscription' });
        }
    }

    return res.status(400).json(null);
}
