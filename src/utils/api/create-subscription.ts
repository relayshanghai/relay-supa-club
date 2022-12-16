import { supabase } from 'src/utils/supabase-client';

export const createSubscription = async ({ company_id, plan_id }: any) => {
    const { error: errorExisting } = await supabase
        .from('subscriptions')
        .update({
            active: false
        })
        .eq('company_id', company_id);

    if (errorExisting) {
        console.log({ errorExisting });
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            company_id,
            plan_id
        })
        .single();

    if (error) {
        // test
        console.log({ error });
    }

    return data;
};
