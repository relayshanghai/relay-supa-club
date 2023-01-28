import { supabase } from 'src/utils/supabase-client';
import { stripeClient } from 'src/utils/stripe-client';

export const ensureCustomer = async ({ cus_id, company_id, id, name }: any, unwrap = false) => {
    if (cus_id) {
        if (unwrap) {
            return cus_id;
        }

        return await stripeClient.customers.retrieve(cus_id);
    }

    const customer = await stripeClient.customers.create({
        name,
        metadata: {
            company_id: company_id || id,
        },
    });

    await supabase
        .from('companies')
        .update({
            cus_id: customer.id,
        })
        .eq('id', company_id || id);

    if (unwrap) {
        return customer.id;
    }

    return customer;
};
