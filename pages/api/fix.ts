/* eslint-disable no-console */
import type { NextApiHandler } from 'next';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { supabase } from 'src/utils/supabase-client';

const _fixStuckInSequenceWithNoEmail: NextApiHandler = async (req, res) => {
    const company_id = '504528ad-8f57-45e2-b82c-59ceb4bc9c54';
    console.log('fixing');
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('*')
        .eq('funnel_status', 'In Sequence')
        .eq('company_id', company_id);
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
            console.log('updating, ', influencer.name);
            await supabase.from('sequence_influencers').update({ funnel_status: 'To Contact' }).eq('id', influencer.id);
            updated.push(influencer.name + ' ' + influencer.id);
        }
    }

    return res.status(200).json({ message: updated });
};

// resets all the influencers/emails mistakenly sent from our account
const fixMisSentEmails: NextApiHandler = async (_req, res) => {
    const accountId = 'egtljwhuz89pfkmj';
    console.log('fixing emails');
    const outbox = await getOutbox();
    const fromJacob = outbox.filter((email) => email.account === accountId).map((email) => email.messageId);
    const fromJacobQueIds = outbox.filter((email) => email.account === accountId).map((email) => email.queueId);
    console.log('fromJacob', fromJacob.length);
    const { data: emails } = await supabase.from('sequence_emails').select('*').in('email_message_id', fromJacob);
    console.log('emails', emails?.length);
    const updated = [];
    const deleted = [];
    if (!emails) return res.status(200).json({ message: 'ok' });
    const canceled = [];

    // deduplicate sequence influencer ids from the emails using a set
    const sequenceInfluencerIds = Array.from(new Set(emails.map((email) => email.sequence_influencer_id)));
    // then convert back to array
    console.log(sequenceInfluencerIds);
    const { data: influencers } = await supabase
        .from('sequence_influencers')
        .select('*')
        .in('id', sequenceInfluencerIds);
    if (influencers)
        for (const influencer of influencers) {
            console.log('updating, ', influencer.name, influencer.email);
            await supabase.from('sequence_influencers').update({ funnel_status: 'To Contact' }).eq('id', influencer.id);
            updated.push(influencer.name + ' ' + influencer.id);
            deleted.push(influencer.id);
        }
    const deleteConfirmed: string[] = [];
    for (const toDelete of deleted) {
        console.log('deleting', toDelete);
        const { data: deleteConfirm } = await supabase
            .from('sequence_emails')
            .delete()
            .eq('sequence_influencer_id', toDelete)
            .select('id');
        deleteConfirmed.concat(deleteConfirm?.map((del) => del.id) ?? '');
    }
    console.log('deleteConfirmed', deleteConfirmed.length);
    console.log('updated', updated.length);
    for (const email of fromJacobQueIds) {
        const canceledConfirm = await deleteEmailFromOutbox(email);
        if (canceledConfirm.deleted) canceled.push(email);
    }
    console.log('canceled', canceled.length);

    return res.status(200).json({ message: 'updated' });
};

export default fixMisSentEmails;
