import type { NextApiHandler } from 'next';
import { supabase } from 'src/utils/supabase-client';

const handler: NextApiHandler = async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('fixing');
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('*')
        .eq('funnel_status', 'In Sequence')
        .eq('company_id', '504528ad-8f57-45e2-b82c-59ceb4bc9c54');
    // console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated = [];
    for (const influencer of allSequenceInfluencers) {
        const { count, error: _error } = await supabase
            .from('sequence_emails')
            .select('id', { count: 'exact' })
            .eq('sequence_influencer_id', influencer.id);
        // console.log('emails', count, '   error: ', error);

        if (count !== null && count === 0) {
            // eslint-disable-next-line no-console
            console.log('updating, ', influencer.name);
            await supabase.from('sequence_influencers').update({ funnel_status: 'To Contact' }).eq('id', influencer.id);
            updated.push(influencer.name + ' ' + influencer.id);
        }
    }

    return res.status(200).json({ message: updated });
};

export default handler;
