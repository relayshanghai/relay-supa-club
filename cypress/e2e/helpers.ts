import type { RelayDatabase, SequenceInfluencer, SequenceInfluencerInsert } from 'src/utils/api/db';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';
import { insertSequenceEmailCall } from 'src/utils/api/db/calls/sequence-emails';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
export const bobEmail = 'bob.brown@example.com';
export const sequenceInfluencerEmails = ['alice.anderson@example.com', bobEmail, 'charlie.charles@example.com'];

export const supabaseClientCypress = () => {
    const supabaseUrl = Cypress.env('NEXT_PUBLIC_SUPABASE_URL') || '';
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
    const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY') || '';
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

    return createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
    });
};

export const reinsertAlice = async () => {
    try {
        const supabase = supabaseClientCypress();
        const email = 'alice.anderson@example.com';
        const { data: aliceExists } = await supabase
            .from('sequence_influencers')
            .select('id')
            .match({ email })
            .single();
        if (aliceExists?.id) return;

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
            .eq('name', 'Alice Anderson')
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
            iqdata_id: '123',
        };
        await supabase.from('sequence_influencers').insert(reinsert);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
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
            iqdata_id: '123',
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

export const insertSequenceEmails = async (supabase: RelayDatabase, sequenceInfluencers: SequenceInfluencer[]) => {
    const results = [];
    for (const sequenceInfluencer of sequenceInfluencers) {
        const sequenceSteps = await getSequenceStepsBySequenceIdCall(supabase)(sequenceInfluencer.sequence_id);
        if (!sequenceSteps) throw new Error('No sequence steps found');
        for (const step of sequenceSteps) {
            await insertSequenceEmailCall(supabase)({
                sequence_influencer_id: sequenceInfluencer.id,
                sequence_id: sequenceInfluencer.sequence_id,
                sequence_step_id: step.id,
                email_delivery_status: 'Scheduled',
                email_message_id: `${sequenceInfluencer.email}${step.step_number}`, // will match the messageId in the mocks email-engine/webhooks/message-sent etc
            });
            results.push({ sequenceInfluencerId: sequenceInfluencer.id, step: step.step_number });
        }
        await updateSequenceInfluencerCall(supabase)({
            id: sequenceInfluencer.id,
            funnel_status: 'In Sequence',
            sequence_step: 0, // handleSent() in pages/api/email-engine/webhook.ts will update the step as the scheduled emails are sent
        });
        return results;
    }
};
export const resetSequenceEmails = async () => {
    const supabase = supabaseClientCypress();
    // delete any emails with message_id which string includes 'example.com' (from the mocks)

    await supabase.from('sequence_emails').delete().like('email_message_id', '%@example.com%');

    const { data: influencers } = await supabase
        .from('sequence_influencers')
        .select('id')
        .in('email', sequenceInfluencerEmails);
    if (!influencers) return;
    for (const influencer of influencers) {
        await updateSequenceInfluencerCall(supabase)({
            id: influencer.id,
            funnel_status: 'To Contact',
            sequence_step: 0,
        });
    }
};

export const randomString = (length = 8) =>
    Math.random()
        .toString(36)
        .substring(2, length + 2);
