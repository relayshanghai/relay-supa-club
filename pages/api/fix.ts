/* eslint-disable no-console */
import type { NextApiHandler } from 'next';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { supabase } from 'src/utils/supabase-client';
import type { CreatorPlatform } from 'types';

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
        .eq('funnel_status', 'In Sequence');
    // .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
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
                if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
                    messedUpCompanies[influencer.company_id] = {
                        name: '',
                        count: 1,
                    };
                } else {
                    messedUpCompanies[influencer.company_id].count++;
                }
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
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', Object.keys(messedUpCompanies));
    companies?.forEach((c) => {
        messedUpCompanies[c.id].name = c.name ?? '';
    });
    console.log('messedUpCompanies', messedUpCompanies);
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

const _fixSequenceInfluencerDataIncomplete: NextApiHandler = async (_req, res) => {
    console.log('fixing');
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, influencer_social_profile_id')
        .is('platform', null);
    const updates: any[] = [];
    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);

    // next step, find all missing avatar urls and see if we can get them from the
    if (allSequenceInfluencers)
        for (const influencer of allSequenceInfluencers) {
            const { data: socialProfile } = await supabase
                .from('influencer_social_profiles')
                .select('*')
                .eq('id', influencer.influencer_social_profile_id)
                .limit(1)
                .single();
            console.log(socialProfile?.username);
            if (socialProfile) {
                const { url, avatar_url, name, platform, username } = socialProfile;
                const update = {
                    url,
                    avatar_url,
                    name,
                    platform: platform as CreatorPlatform,
                    username,
                    social_profile_last_fetched: new Date().toISOString(),
                };
                console.log(update);
                if (!update.platform || !update.username || !update.username || !update.url) {
                    console.log('missing data', update, influencer);
                    continue;
                }
                const { data: updated } = await supabase
                    .from('sequence_influencers')
                    .update(update)
                    .eq('id', influencer.id)
                    .select()
                    .single();
                updates.push(updated?.platform);
                console.log(`${updated?.platform}`);
            } else {
                console.log('social profile not found', influencer);
            }
        }
    console.log(updates);
    return res.status(200).json({ message: updates });
};
const _fixSocialProfileIncomplete: NextApiHandler = async (_req, res) => {
    console.log('fixing');
    const { data: incompleteSocialProfiles } = await supabase
        .from('influencer_social_profiles')
        .select('*')
        .is('platform', null);
    console.log('incompleteSocialProfiles', incompleteSocialProfiles?.length);
    const { data: reportSnapshots } = await supabase.from('report_snapshots').select('*');
    if (incompleteSocialProfiles)
        for (const profile of incompleteSocialProfiles) {
            console.log(profile);
        }
    console.log(reportSnapshots);
    return res.json({ ok: 'asd' });
};

const _fixUppercaseEmails: NextApiHandler = async (_req, res) => {
    console.log('fixUppercaseEmails');

    const { data: influencersWithEmails } = await supabase
        .from('sequence_influencers')
        .select('id, email')
        .not('email', 'is', null);

    console.log('found', influencersWithEmails?.length);
    const { data: profilesWithEmails } = await supabase
        .from('influencer_social_profiles')
        .select('id, email')
        .not('email', 'is', null);
    console.log('found', profilesWithEmails?.length);

    const influencerResults = [];
    if (influencersWithEmails)
        for (const influencer of influencersWithEmails) {
            if (!influencer.email) continue;
            //if contains uppercase letters, update to lowercase
            if (influencer.email !== influencer.email.toLowerCase().trim()) {
                influencerResults.push(`${influencer.email} ${influencer.email.toLowerCase().trim()}`);
                await supabase
                    .from('sequence_influencers')
                    .update({ email: influencer.email.toLowerCase().trim() })
                    .eq('id', influencer.id);
            }
        }

    const profileResults = [];
    if (profilesWithEmails)
        for (const influencer of profilesWithEmails) {
            if (!influencer.email) continue;
            //if contains uppercase letters, update to lowercase
            if (influencer.email !== influencer.email.toLowerCase().trim()) {
                profileResults.push(`${influencer.email} ${influencer.email.toLowerCase().trim()}`);
                await supabase
                    .from('sequence_influencers')
                    .update({ email: influencer.email.toLowerCase().trim() })
                    .eq('id', influencer.id);
            }
        }

    console.log('finished, total results', influencerResults.length, profileResults.length);
    return res.json({ ok: 'asd' });
};

const fixSequenceEmailsNoAccountId: NextApiHandler = async (_req, res) => {
    const { data: hasSequenceSendProfiles } = await supabase
        .from('profiles')
        .select('id')
        .not('sequence_send_account_id', 'is', null);
    console.log({ hasSequenceSendProfiles });
    console.log('hasSequenceSendProfiles', hasSequenceSendProfiles?.length);
    return res.json({ ok: 'asd' });
};

export default fixSequenceEmailsNoAccountId;
