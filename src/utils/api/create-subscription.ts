import { supabase } from 'src/utils/supabase-client';

export const createSubscription = async ({ company_id, plan_id }: any) => {
    const { error: errorExisting } = await supabase
        .from('subscriptions')
        .update({
            active: false
        })
        .eq('company_id', company_id);

    console.log({ errorExisting });

    if (errorExisting) {
        // throw errorExisting;
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            company_id,
            plan_id
        })
        .single();

    console.log({ error });

    if (error) {
        // throw error;
    }

    return data;
};
