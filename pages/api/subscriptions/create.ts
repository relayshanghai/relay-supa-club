import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, price_id } = JSON.parse(req.body);

        try {
            const { data } = (await supabase
                .from('companies')
                .select('cus_id')
                .eq('id', company_id)
                .single()) as any;

            await stripeClient.customers.listPaymentMethods(data.cus_id, {
                type: 'card'
            });

            const subscriptions = await stripeClient.subscriptions.list({
                customer: data.cus_id,
                status: 'active'
            });
            const activeSubscription = subscriptions.data[0];

            if (activeSubscription) {
                await stripeClient.subscriptions.cancel(activeSubscription.id, {
                    invoice_now: true,
                    prorate: true
                });
            }

            const subscription = await stripeClient.subscriptions.create({
                customer: data.cus_id,
                items: [{ price: price_id }],
                proration_behavior: 'create_prorations'
            });

            const price = await stripeClient.prices.retrieve(price_id);
            const product = await stripeClient.products.retrieve(price.product as string);

            await supabase
                .from('companies')
                .update({
                    usage_limit: product.metadata.usage_limit
                })
                .eq('id', company_id);

            return res.status(200).json(subscription);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    return res.status(400).json(null);
}
