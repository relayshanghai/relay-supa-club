import type { RelayDatabase, SequenceInfluencerInsert } from 'src/utils/api/db';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const supabaseClientCypress = () => {
    const supabaseUrl = Cypress.env('NEXT_PUBLIC_SUPABASE_URL') || '';
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
    const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY') || '';
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

    return createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
    });
};

export const reinsertCharlie = async () => {
    try {
        const supabase = supabaseClientCypress();
        const email = 'charlie.charles@example.com';
        const { data: charlesExists } = await supabase
            .from('sequence_influencers')
            .select('id')
            .match({ email })
            .single();
        if (charlesExists?.id) return;

        const { data: testCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('name', 'Blue Moonlight Stream Enterprises')
            .single();
        const { data: testUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', 'christopher.david.thompson@blue-moonlight-stream.com')
            .single();
        const { data: testSequence } = await supabase
            .from('sequences')
            .select('id')
            .eq('name', 'General collaboration')
            .single();
        const { data: charlieProfile } = await supabase
            .from('influencer_social_profiles')
            .select('id')
            .eq('name', 'Charlie Charles')
            .single();
        const reinsert: SequenceInfluencerInsert = {
            added_by: testUser?.id || '',
            company_id: testCompany?.id || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sequence_id: testSequence?.id || '',
            influencer_social_profile_id: charlieProfile?.id || '',
            funnel_status: 'To Contact',
            sequence_step: 0,
            email,
        };
        await supabase.from('sequence_influencers').insert(reinsert);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

export const resetUsages = (supabase: RelayDatabase) => {
    supabase.from('usages').delete().neq('created_at', new Date(0).toISOString());
};
