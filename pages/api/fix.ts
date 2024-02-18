/* eslint-disable no-console */
import type { NextApiHandler } from 'next';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { supabase } from 'src/utils/supabase-client';
import type { CreatorPlatform } from 'types';
import type { ProfileInsertBody } from './profiles';
import { emailRegex } from 'src/constants';
import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
import { wait } from 'src/utils/utils';

const _fixSequenceStepDoesNotBelongToInfluencerSequence: NextApiHandler = async (_req, res) => {
    // some influencers were created with sequence_step_id's from another sequence. For each influencer, pull their `sequence_steps` for the right sequence. If the influencer's `sequence_step_id` is not in the `sequence_steps` for that sequence, set the id to the corresponding `sequence_step_number` for that sequence.
    console.log('fixing fixSequenceStepDoesNotBelongToInfluencerSequence');
    // const _company_ids = ['7b0b4586-57d3-4909-8489-45b726e94510'];
    const { data: companiesWithOutreach } = await supabase
        .from('companies')
        .select('id, name, cus_id')
        .eq('subscription_plan', 'Outreach');
    const _company_ids = companiesWithOutreach?.map((c) => c.id) ?? [];
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, sequence_step, sequence_id')
        .eq('funnel_status', 'In Sequence')
        .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const sequenceIds: string[] = [];
    allSequenceInfluencers.forEach((i) => {
        if (!sequenceIds.includes(i.sequence_id)) sequenceIds.push(i.sequence_id);
    });
    console.log('sequenceIds', sequenceIds.length);
    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('*')
        .in('sequence_id', sequenceIds);
    console.log('allSequenceEmails', allSequenceEmails?.length);

    const { data: sequenceSteps } = await supabase.from('sequence_steps').select('*');
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
    for (const influencer of allSequenceInfluencers) {
        const properSteps = sequenceSteps?.filter((s) => s.sequence_id === influencer.sequence_id);
        const emails = allSequenceEmails?.filter((e) => e.sequence_influencer_id === influencer.id) ?? [];
        for (const email of emails) {
            if (email.sequence_id !== influencer.sequence_id) {
                console.log('email sequence id incorrect', email.sequence_id, influencer.sequence_id);
                continue;
            }
            const step = properSteps?.find((s) => s.id === email.sequence_step_id);
            if (!step) {
                const originalStep = sequenceSteps?.find((s) => s.id === email.sequence_step_id);
                const properStep = properSteps?.find((s) => s.step_number === originalStep?.step_number);
                if (properStep) {
                    await supabase
                        .from('sequence_emails')
                        .update({ sequence_step_id: properStep.id })
                        .eq('id', email.id);
                    updated.push(email.id);
                    if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
                        messedUpCompanies[influencer.company_id] = {
                            name: companiesWithOutreach?.find((c) => c.id === influencer.company_id)?.name ?? '',
                            count: 1,
                        };
                    } else {
                        messedUpCompanies[influencer.company_id].count++;
                    }
                }
            }
        }
    }

    console.log('updated', updated.length);
    console.log('messedUpCompanies', messedUpCompanies);
    return res.status(200).json({ message: updated });
};

const _fixSequenceStepDoesNotMatchNumberOfEmails: NextApiHandler = async (_req, res) => {
    // if a user has 3 emails already delivered, they should be on step 2
    console.log('fixing _fixSequenceStepDoesNotMatchNumberOfEmails');
    const { data: companiesWithOutreach } = await supabase
        .from('companies')
        .select('id, name, cus_id')
        .eq('subscription_plan', 'Outreach');
    const _company_ids = companiesWithOutreach?.map((c) => c.id) ?? [];
    // const _company_ids = ['7b0b4586-57d3-4909-8489-45b726e94510'];
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, sequence_step, sequence_id')
        .eq('funnel_status', 'In Sequence')
        .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
    const sequenceIds: string[] = [];
    allSequenceInfluencers.forEach((i) => {
        if (!sequenceIds.includes(i.sequence_id)) sequenceIds.push(i.sequence_id);
    });
    console.log('sequenceIds', sequenceIds.length);
    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('*')
        .in('sequence_id', sequenceIds);
    console.log('allSequenceEmails', allSequenceEmails?.length);
    // const sentMalformed = [];
    // const outbox = await getOutbox();

    for (const influencer of allSequenceInfluencers) {
        try {
            const emails = allSequenceEmails?.filter((e) => e.sequence_influencer_id === influencer.id);
            // console.log('count mismatch', influencer.name, count, influencer.sequence_step);
            const hasAlreadyDelivered = emails?.filter(
                (e) =>
                    e.email_delivery_status !== null &&
                    (e.email_delivery_status === 'Delivered' || e.email_delivery_status === 'Replied'),
            );

            const shouldSequenceStep = hasAlreadyDelivered?.length ? hasAlreadyDelivered?.length - 1 : 0;
            console.log(emails?.length, hasAlreadyDelivered?.length, influencer.sequence_step);
            // sequencestep should match already delivered -1
            if (shouldSequenceStep === influencer.sequence_step) {
                continue;
            }
            if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
                messedUpCompanies[influencer.company_id] = {
                    name: '',
                    count: 1,
                };
            } else {
                messedUpCompanies[influencer.company_id].count++;
            }
            console.log(
                'updating, ',
                influencer.name,
                influencer.company_id,
                influencer.sequence_step + ' ' + shouldSequenceStep,
            );
            await supabase
                .from('sequence_influencers')
                .update({ sequence_step: shouldSequenceStep })
                .eq('id', influencer.id);
            updated.push(influencer.sequence_step + ' ' + shouldSequenceStep);
        } catch (error) {
            console.log('error with influencer', influencer.name, influencer.id);
            console.error(error);
        }
    }

    companiesWithOutreach?.forEach((c) => {
        messedUpCompanies[c.id].name = c.name ?? '';
    });
    console.log('messedUpCompanies', messedUpCompanies);
    console.log('updated', updated.length);
    // console.log('sentMalformed', sentMalformed.length, sentMalformed);

    return res.status(200).json({ message: updated });
};

const _fixInToContactWithEmails: NextApiHandler = async (_req, res) => {
    // const _company_ids = [
    //     // 'f5009eba-1af2-46f4-be3a-dfe2221d35ed',
    //     'd9d76bb4-9fe5-4ddb-bf1b-83eea7505281',
    //     '625aa3ea-a54e-436a-a4c6-89ee09b148bb',
    //     '2d01d750-8668-4990-812f-38b36c35e8c3',
    //     '00da5f09-4ce1-404e-a2ce-18f137b739e2',
    //     'd2d8534b-65c3-4e21-89a7-f8c9aa570b79',
    //     '35a9af70-3c7f-4873-9f10-eebece955b83',
    //     '12513ff1-c7d9-417c-9e38-7e9d8de459bd',
    //     '3d52ee9a-c9e4-46c1-9264-0bd4c096f9ae',
    //     '7b0b4586-57d3-4909-8489-45b726e94510',
    //     '70215f95-2953-4b88-a445-1b0b8886f389',
    // ];
    console.log('fixing fixInToContactWithEmails');
    const { data: companiesWithOutreach } = await supabase
        .from('companies')
        .select('id, name, cus_id')
        .eq('subscription_plan', 'Outreach');
    const _company_ids = companiesWithOutreach?.map((c) => c.id) ?? [];

    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, sequence_step, sequence_id')
        .eq('funnel_status', 'To Contact')
        .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
    const sequenceIds: string[] = [];
    allSequenceInfluencers.forEach((i) => {
        if (!sequenceIds.includes(i.sequence_id)) sequenceIds.push(i.sequence_id);
    });
    console.log('sequenceIds', sequenceIds.length);
    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('*')
        .in('sequence_id', sequenceIds);
    console.log('allSequenceEmails', allSequenceEmails?.length);
    // const sentMalformed = [];
    const outbox = await getOutbox();

    for (const influencer of allSequenceInfluencers) {
        try {
            const emails = allSequenceEmails?.filter((e) => e.sequence_influencer_id === influencer.id);
            const count = emails?.length ?? 0;
            // console.log('emails', count);
            if (count > 0) {
                const hasAlreadyDelivered = emails?.some(
                    (e) => e.email_delivery_status && e.email_delivery_status !== 'Scheduled',
                );
                if (hasAlreadyDelivered) {
                    console.log('hasAlreadyDelivered', influencer.id, influencer.company_id);
                    continue;
                }
                if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
                    messedUpCompanies[influencer.company_id] = {
                        name: '',
                        count: 1,
                    };
                } else {
                    messedUpCompanies[influencer.company_id].count++;
                }
                const messageIds = emails?.map((e) => e.email_message_id);
                console.log('updating, ', influencer.name, influencer.company_id);
                await supabase
                    .from('sequence_influencers')
                    .update({ funnel_status: 'To Contact', sequence_step: 0 })
                    .eq('id', influencer.id);
                updated.push(influencer.name + ' ' + influencer.id);
                const outboxToDelete = outbox.filter((e) => messageIds?.includes(e.messageId)).map((e) => e.queueId);
                for (const email of outboxToDelete) {
                    const canceledConfirm = await deleteEmailFromOutbox(email);
                    console.log(`canceled ${email} ${canceledConfirm.deleted}`);
                }

                // console.log('deleting', emails);
                if (count > 0) {
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

    companiesWithOutreach?.forEach((c) => {
        messedUpCompanies[c.id].name = c.name ?? '';
    });
    console.log('messedUpCompanies', messedUpCompanies);
    console.log('updated', updated.length);
    // console.log('sentMalformed', sentMalformed.length, sentMalformed);

    return res.status(200).json({ message: updated });
};

const _fixStuckInSequenceWithNoEmail: NextApiHandler = async (req, res) => {
    // const _company_ids = [
    //     // 'f5009eba-1af2-46f4-be3a-dfe2221d35ed',
    //     // 'd9d76bb4-9fe5-4ddb-bf1b-83eea7505281',
    //     '625aa3ea-a54e-436a-a4c6-89ee09b148bb',
    //     // '2d01d750-8668-4990-812f-38b36c35e8c3',
    //     // '00da5f09-4ce1-404e-a2ce-18f137b739e2',
    //     // 'd2d8534b-65c3-4e21-89a7-f8c9aa570b79',
    //     // '35a9af70-3c7f-4873-9f10-eebece955b83',
    //     // '12513ff1-c7d9-417c-9e38-7e9d8de459bd',
    //     // '3d52ee9a-c9e4-46c1-9264-0bd4c096f9ae',
    //     // '7b0b4586-57d3-4909-8489-45b726e94510',
    //     // '70215f95-2953-4b88-a445-1b0b8886f389',
    // ];
    console.log('fixing _fixStuckInSequenceWithNoEmail');
    const { data: companiesWithOutreach } = await supabase
        .from('companies')
        .select('id, name, cus_id')
        .eq('subscription_plan', 'Outreach');
    const _company_ids = companiesWithOutreach?.map((c) => c.id) ?? [];
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, sequence_step, sequence_id')
        .eq('funnel_status', 'In Sequence')
        .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
    const sequenceIds: string[] = [];
    allSequenceInfluencers.forEach((i) => {
        if (!sequenceIds.includes(i.sequence_id)) sequenceIds.push(i.sequence_id);
    });
    console.log('sequenceIds', sequenceIds.length);
    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('*')
        .in('sequence_id', sequenceIds);
    console.log('allSequenceEmails', allSequenceEmails?.length);
    // const sentMalformed = [];
    const outbox = await getOutbox();

    for (const influencer of allSequenceInfluencers) {
        try {
            const emails = allSequenceEmails?.filter((e) => e.sequence_influencer_id === influencer.id);
            const count = emails?.length ?? 0;
            // console.log('emails', count);
            if (count !== influencer.sequence_step + 1) {
                if (count === 4 && influencer.sequence_step === 0) continue;
                console.log('count mismatch', influencer.name, count, influencer.sequence_step);
                const hasAlreadyDelivered = emails?.some(
                    (e) => e.email_delivery_status && e.email_delivery_status !== 'Scheduled',
                );
                if (hasAlreadyDelivered) {
                    console.log('hasAlreadyDelivered', influencer.id, influencer.company_id);
                    continue;
                }
                if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
                    messedUpCompanies[influencer.company_id] = {
                        name: '',
                        count: 1,
                    };
                } else {
                    messedUpCompanies[influencer.company_id].count++;
                }
                const messageIds = emails?.map((e) => e.email_message_id);
                console.log('updating, ', influencer.name, influencer.company_id);
                await supabase
                    .from('sequence_influencers')
                    .update({ funnel_status: 'To Contact', sequence_step: 0 })
                    .eq('id', influencer.id);
                updated.push(influencer.name + ' ' + influencer.id);
                const outboxToDelete = outbox.filter((e) => messageIds?.includes(e.messageId)).map((e) => e.queueId);
                for (const email of outboxToDelete) {
                    const canceledConfirm = await deleteEmailFromOutbox(email);
                    console.log(`canceled ${email} ${canceledConfirm.deleted}`);
                }

                // console.log('deleting', emails);
                if (count > 0) {
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

const _fixSequenceEmailsNoAccountId: NextApiHandler = async (_req, res) => {
    console.log('fixSequenceEmailsNoAccountId');
    console.time('fixSequenceEmailsNoAccountId');
    const { data: hasSequenceSendProfiles } = await supabase
        .from('profiles')
        .select('id, email_engine_account_id')
        .not('email_engine_account_id', 'is', null);
    console.log('hasSequenceSendProfiles', hasSequenceSendProfiles?.length);

    const { data: influencers } = await supabase
        .from('sequence_influencers')
        .select('id, added_by')
        .in('added_by', hasSequenceSendProfiles?.map((p) => p.id) ?? []);

    console.log('influencers', influencers?.length);

    const { data: emails } = await supabase
        .from('sequence_emails')
        .select('id, sequence_influencer_id, email_message_id')
        .is('email_engine_account_id', null);

    console.log(emails?.length);
    const results = [];
    if (emails)
        for (const email of emails) {
            const influencer = influencers?.find((i) => i.id === email.sequence_influencer_id);
            if (influencer) {
                const profile = hasSequenceSendProfiles?.find((p) => p.id === influencer.added_by);
                if (!profile || !profile.email_engine_account_id) {
                    console.log('no profile found', profile);
                    continue;
                }
                // console.log('updating', profile.email_engine_account_id);
                await supabase
                    .from('sequence_emails')
                    .update({ email_engine_account_id: profile.email_engine_account_id })
                    .eq('id', email.id);
                results.push(email.id);
            } else {
                console.log('no influencer found', email.sequence_influencer_id);
            }
        }
    console.log(results.length);
    console.timeEnd('fixSequenceEmailsNoAccountId');

    return res.json({ ok: 'asd' });
};

const _fixDeleteInfluencersStillSendingEmails: NextApiHandler = async (_req, res) => {
    console.log('fixDeleteInfluencersStillSendingEmails');
    const outbox = await getOutbox();
    console.log('outbox', outbox.length);
    const results = [];

    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('id, sequence_influencer_id, email_message_id');
    console.log('allSequenceEmails', allSequenceEmails?.length);

    const { data: sequenceInfluencers } = await supabase.from('sequence_influencers').select('id, name');
    console.log('sequenceInfluencers', sequenceInfluencers?.length);
    if (allSequenceEmails)
        for (const message of outbox) {
            const sequenceEmail = allSequenceEmails.find((e) => e.email_message_id === message.messageId);
            // delete if no sequence email
            if (!sequenceEmail) {
                console.log('deleting', message.queueId);
                await deleteEmailFromOutbox(message.queueId);
                results.push(message.queueId);
                continue;
            }

            const sequenceInfluencer = sequenceInfluencers?.find((i) => i.id === sequenceEmail.sequence_influencer_id);
            //delete if no sequence influencer
            if (!sequenceInfluencer) {
                console.log('cancelling', message.queueId);
                await deleteEmailFromOutbox(message.queueId);
                results.push(message.queueId);
                await supabase.from('sequence_emails').delete().eq('email_message_id', message.messageId);

                continue;
            } else {
                // console.log('found', sequenceInfluencer.name);
            }
        }
    console.log('results', results.length);
    return res.json({ results });
};

const _deleteSequenceEmailsWithNoInfluencer: NextApiHandler = async (_req, res) => {
    console.log('deleteSequenceEmailsWithNoInfluencer');
    const { data: emails } = await supabase
        .from('sequence_emails')
        .select('id, sequence_influencer_id, email_message_id');
    console.log('emails', emails?.length);
    const outbox = await getOutbox();

    const { data: sequenceInfluencers } = await supabase.from('sequence_influencers').select('id, name');
    console.log('sequenceInfluencers', sequenceInfluencers?.length);

    const results = [];
    if (emails)
        for (const email of emails) {
            const sequenceInfluencer = sequenceInfluencers?.find((i) => i.id === email.sequence_influencer_id);
            if (!sequenceInfluencer) {
                console.log('deleting', email.id);
                const outboxMessage = outbox.find((e) => e.messageId === email.email_message_id);
                if (outboxMessage) {
                    console.log('cancelling outbox message');
                    await deleteEmailFromOutbox(outboxMessage.queueId);
                }
                await supabase.from('sequence_emails').delete().eq('id', email.id);

                results.push(email.id);
            }
        }
    console.log('results', results.length);
    return res.json({ results });
};

const _addAdminSuperuserToEachAccount: NextApiHandler = async (_req, res) => {
    const password = process.env.SERVICE_ACCOUNT_PASSWORD ?? 'password';
    const { data: companiesAll } = await supabase.from('companies').select('id, name, cus_id');
    const results = [];
    const companies = companiesAll;
    console.log('companies', companies?.length);
    if (companies)
        for (const company of companies) {
            if (!company.name || !company.cus_id) {
                // console.log('no company name or cus_id', company);
                continue;
            }
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, email, email_engine_account_id, sequence_send_email')
                .eq('company_id', company.id);

            const hasServiceAccount = profiles?.some((p) => p.email?.includes('support+'));
            if (hasServiceAccount) {
                continue;
            }
            const hasAccountProfile = profiles?.find((p) => p.email_engine_account_id);

            const emailBadCharactersReplacer = (email: string) => {
                return email.replace(/[.,'"\(\) ]/g, '');
            };

            const identifier = emailBadCharactersReplacer(company.cus_id.toLowerCase().trim());
            const email = `support+${identifier}@boostbot.ai`;
            const emailCheck = emailRegex.test(email);
            if (!emailCheck) {
                console.log('email invalid', email);
                continue;
            }
            const { error, data: signupResData } = await supabase.auth.signUp({
                email,
                password,
            });
            let id = signupResData?.user?.id;
            if (error?.message.includes('User already registered')) {
                const { error: error2, data: signinResData } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                id = signinResData?.user?.id;
                if (error2) {
                    console.log(error2?.message || 'Unknown error', email);
                    continue;
                }
            }

            if (!id) {
                console.log('Error creating profile, no id in response');
                continue;
            }
            const profileBody: ProfileInsertBody = {
                id,
                email,
                company_id: company.id,
                first_name: 'BoostBot',
                last_name: 'Support',
                user_role: 'company_owner',
                email_engine_account_id: hasAccountProfile?.email_engine_account_id,
                sequence_send_email: hasAccountProfile?.sequence_send_email,
            };
            const { data, error: error2 } = await supabase.from('profiles').upsert(profileBody).select('*').single();
            if (!data || error2) {
                console.log('error inserting profile', error2?.message || 'unknown error');
                continue;
            }
            console.log('created profile', data);
            results.push(email);
        }
    console.log('results', results);
    return res.json({ results });
};

const _fixStuckInSequenceWithNoEmailSent: NextApiHandler = async (_req, res) => {
    const { data: companiesWithOutreach } = await supabase
        .from('companies')
        .select('id, name, cus_id')
        .eq('subscription_plan', 'Outreach');
    // const _company_ids = ['6ee1bd6c-100f-497f-b6ee-c38f93a29c9d'];
    const _company_ids = companiesWithOutreach?.map((c) => c.id) ?? [];
    const { data: allSequenceInfluencers } = await supabase
        .from('sequence_influencers')
        .select('id, name, company_id, sequence_step, sequence_id')
        .eq('funnel_status', 'In Sequence')
        .in('company_id', _company_ids);

    console.log('allSequenceInfluencers', allSequenceInfluencers?.length);
    if (!allSequenceInfluencers) return res.status(200).json({ message: 'ok' });
    const updated: any = [];
    const messedUpCompanies: {
        [companyId: string]: {
            name: string;
            count: number;
        };
    } = {};
    const sequenceIds: string[] = [];
    allSequenceInfluencers.forEach((i) => {
        if (!sequenceIds.includes(i.sequence_id)) sequenceIds.push(i.sequence_id);
    });
    console.log('sequenceIds', sequenceIds.length);
    const { data: allSequenceEmails } = await supabase
        .from('sequence_emails')
        .select('*')
        .in('sequence_id', sequenceIds);

    console.log('allSequenceEmails', allSequenceEmails?.length);

    const outbox = await getOutbox();

    allSequenceInfluencers.forEach(async (influencer) => {
        const emails = allSequenceEmails?.filter((e) => e.sequence_influencer_id === influencer.id);
        console.log('emails', emails?.length);
        const hasAlreadyDelivered = emails?.some(
            (e) => e.email_delivery_status && e.email_delivery_status !== 'Scheduled',
        );
        if (emails?.length && emails?.length !== 0) {
            return;
        }

        if (hasAlreadyDelivered) {
            console.log('hasAlreadyDelivered', influencer.id, influencer.company_id);
            return;
        }
        if (!Object.keys(messedUpCompanies).includes(influencer.company_id)) {
            messedUpCompanies[influencer.company_id] = {
                name: '',
                count: 1,
            };
        } else {
            messedUpCompanies[influencer.company_id].count++;
        }
        const messageIds = emails?.map((e) => e.email_message_id);
        console.log('updating, ', influencer.name, influencer.company_id);
        const outboxToDelete = outbox.filter((e) => messageIds?.includes(e.messageId)).map((e) => e.queueId);
        for (const email of outboxToDelete) {
            const canceledConfirm = { deleted: null }; // await deleteEmailFromOutbox(email);
            console.log(`canceled ${email} ${canceledConfirm.deleted}`);
        }

        // console.log('deleting', emails);
        if (emails?.length) {
            // const { data: deleteConfirm } = await supabase
            //     .from('sequence_emails')
            //     .delete()
            //     .eq('sequence_influencer_id', influencer.id)
            //     .select('id');
            // console.log('deleteConfirmed', deleteConfirm?.length);
        }
        await supabase
            .from('sequence_influencers')
            .update({ funnel_status: 'To Contact', sequence_step: 0 })
            .eq('id', influencer.id);
        updated.push(influencer.name + ' ' + influencer.id);
    });

    console.log('messedUpCompanies', messedUpCompanies);
    return res.status(200).json({ message: updated });
};

const _findEmailInOutbox: NextApiHandler = async (_req, res) => {
    const messageId = '<5bde7f03-4e41-4f5d-8aa4-b3b21dba18df@gmail.com>';
    const outbox = await getOutbox();
    outbox.sort((a, b) => {
        return new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime();
    });
    const found = outbox.find((e) => e.messageId === messageId);
    console.log(found);
    const index = outbox.findIndex((e) => e.messageId === messageId);
    console.log(index, 'out of ', outbox.length);
    return res.status(200).json({ message: found });
};

const _checkHowManyJobsCreatedPerInfluencer: NextApiHandler = async (_req, res) => {
    console.log('checkHowManyJobsCreatedPerInfluencer');
    const influencerId = '67413fd1-02ca-4783-8e34-63773aea19ff';
    const { data: allJobs } = await supabase.from('jobs').select('*').eq('queue', 'sequence_step_send');

    const jobsPayloads = allJobs?.map((j) => j.payload) as SequenceStepSendArgs[];

    console.log('jobsPayloads', jobsPayloads?.length, jobsPayloads[0]);

    const jobs = jobsPayloads.filter((j) => j.sequenceInfluencer.id === influencerId);

    console.log({ jobs });
    return res.status(200).json({ message: jobs.length });
};

const _fixOutboxEmailsHaveNoSequenceEmailRecord: NextApiHandler = async (_req, res) => {
    console.log('fixOutboxEmailsHaveNoSequenceEmailRecord');
    const outbox = await getOutbox();

    let { data: allSequenceEmails } = await supabase.from('sequence_emails').select('*');
    console.log('allSequenceEmails', allSequenceEmails?.length);

    // check for sequence emails that have no influencer. delete them

    allSequenceEmails = (await supabase.from('sequence_emails').select('*')).data ?? [];
    console.log('allSequenceEmails', allSequenceEmails?.length);

    const results: any[] = [];
    for (const email of outbox) {
        const sequenceEmail = allSequenceEmails?.find((e) => e.email_message_id === email.messageId);
        if (!sequenceEmail) {
            try {
                const deleted = await deleteEmailFromOutbox(email.queueId);
                console.log('deleted', deleted.deleted, email.queueId);
                await wait(1000);
                results.push(email.queueId);
            } catch (error) {
                console.log(error);
            }
        }
    }

    console.log('results', results.length);
    return res.status(200).json({ message: results });
};

export default _addAdminSuperuserToEachAccount;
