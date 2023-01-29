import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, price_id } = JSON.parse(req.body);

        try {
            const { data: companyData } = await supabase
                .from('companies')
                .select('cus_id')
                .eq('id', company_id)
                .single();

            if (!companyData || !companyData.cus_id) {
                return res.status(500).json({ error: 'Missing company data' });
            }

            await stripeClient.customers.listPaymentMethods(companyData.cus_id);

            const subscriptions = await stripeClient.subscriptions.list({
                customer: companyData.cus_id,
                status: 'active',
            });
            const activeSubscription = subscriptions.data[0];

            if (activeSubscription) {
                await stripeClient.subscriptions.cancel(activeSubscription.id, {
                    invoice_now: true,
                    prorate: true,
                });
            }

            const subscription = await stripeClient.subscriptions.create({
                customer: companyData.cus_id,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations',
            });

            const price = await stripeClient.prices.retrieve(price_id);
            const product = await stripeClient.products.retrieve(price.product as string);

            await supabase
                .from('companies')
                .update({
                    profiles_limit: product.metadata.profiles,
                    searches_limit: product.metadata.searches,
                })
                .eq('id', company_id);

            return res.status(200).json(subscription);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    return res.status(400).json(null);
}
