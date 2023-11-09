/* eslint-disable no-console */
import type { NextApiHandler } from 'next';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { supabase } from 'src/utils/supabase-client';

const _fixStuckInSequenceWithNoEmail: NextApiHandler = async (req, res) => {
    const _company_ids = [
        '504528ad-8f57-45e2-b82c-59ceb4bc9c54',
        '9ffda880-addd-4d28-b247-92b1884a3cd9',
        '625aa3ea-a54e-436a-a4c6-89ee09b148bb',
        'd9d76bb4-9fe5-4ddb-bf1b-83eea7505281',
        '2d01d750-8668-4990-812f-38b36c35e8c3',
        'ea8ad9fb-7c52-46c3-bd95-4709b1dc70a5',
    ];
    console.log('fixing');
    const outbox = await getOutbox();

    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id')
        .eq('funnel_status', 'In Sequence')
        .in('company_id', _company_ids);
    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    // const sentMalformed = [];
    for (const influencer of allSequenceInfluencers) {
        try {
            const {
                data: emails,
                count,
                error: _error,
            } = await supabase
                .from('sequence_emails')
                .select('email_message_id', { count: 'exact' })
                .eq('sequence_influencer_id', influencer.id);
            // console.log('emails', count, '   error: ', _error);

            if (emails && count !== null && count < 4) {
                // const hasAlreadyDelivered = emails.some(
                //     (e) =>
                //         e.email_delivery_status === 'Delivered' ||
                //         e.email_tracking_status === 'Link Clicked' ||
                //         e.email_tracking_status === 'Opened',
                // );
                // if (hasAlreadyDelivered) {
                //     console.log('hasAlreadyDelivered', influencer.id, influencer.company_id);
                //     sentMalformed.push(`${influencer.name} ${influencer.id} ${influencer.company_id}`);
                //     continue;
                // }
                const messageIds = emails.map((e) => e.email_message_id);
                console.log('updating, ', influencer.name, influencer.company_id);
                await supabase
                    .from('sequence_influencers')
                    .update({ funnel_status: 'To Contact' })
                    .eq('id', influencer.id);
                updated.push(influencer.name + ' ' + influencer.id);
                const outboxToDelete = outbox.filter((e) => messageIds.includes(e.messageId)).map((e) => e.queueId);
                for (const email of outboxToDelete) {
                    const canceledConfirm = await deleteEmailFromOutbox(email);
                    console.log(`canceled ${email} ${canceledConfirm.deleted}`);
                }

                // console.log('deleting', emails);
                if (emails.length > 0) {
                    const { data: deleteConfirm } = await supabase
                        .from('sequence_emails')
                        .delete()
                        .eq('sequence_influencer_id', influencer.id)
                        .select('id');

                    console.log('deleteConfirmed', deleteConfirm?.length);
                }
            }
        } catch (error) {
            console.log('error with influencer', influencer.name, influencer.id);
            console.error(error);
        }
    }
    console.log('updated', updated.length);
    // console.log('sentMalformed', sentMalformed.length, sentMalformed);

    return res.status(200).json({ message: updated });
};

// resets all the influencers/emails mistakenly sent from our account
const _fixMisSentEmails: NextApiHandler = async (_req, res) => {
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

const _fixHalfSentSequence: NextApiHandler = async (_req, res) => {
    const influencerId = '9c0ec006-a152-4cf9-83d7-7b024a7fa556';
    const { data: emails } = await supabase
        .from('sequence_emails')
        .select('*')
        .eq('sequence_influencer_id', influencerId);
    console.log(emails);
    const messageIds = emails?.map((e) => e.email_message_id);
    const outbox = await getOutbox();
    const toDelete = outbox.filter((email) => messageIds?.includes(email.messageId)).map((email) => email.queueId);
    console.log({ toDelete });
    toDelete.forEach(async (email) => {
        await deleteEmailFromOutbox(email);
    });
    await supabase.from('sequence_emails').delete().eq('sequence_influencer_id', influencerId);
    return res.status(200).json({ message: toDelete });
};

export default _fixStuckInSequenceWithNoEmail;
