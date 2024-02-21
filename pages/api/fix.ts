/* eslint-disable no-console */
import type { NextApiHandler } from 'next';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { supabase } from 'src/utils/supabase-client';
import type { CreatorPlatform } from 'types';
import type { ProfileInsertBody } from './profiles';
import { companies, jobs, profiles as profilesSchema, sequence_emails } from '../../drizzle/schema';
import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
import { wait } from 'src/utils/utils';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { and, eq, ilike, inArray, notInArray, or, asc } from 'drizzle-orm';
let shouldStop = false;

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
    console.log('fixing, addAdminSuperuserToEachAccount');
    shouldStop = false;

    const password = process.env.SERVICE_ACCOUNT_PASSWORD ?? '';
    if (!password) {
        throw new Error('No password found');
    }
    const supportUsers =
        (
            await db()
                .select({ company_id: profilesSchema.company_id })
                .from(profilesSchema)
                .where(ilike(profilesSchema.email, '%support+%'))
        )?.map((p) => p.company_id ?? '') ?? [];

    const companiesWithoutServiceAccounts = await db()
        .select()
        .from(companies)
        .where(notInArray(companies.id, supportUsers));

    const results = [];
    const noServiceAccountCompanies = [];

    console.log('companies', companiesWithoutServiceAccounts?.length);
    if (companiesWithoutServiceAccounts)
        for (const company of companiesWithoutServiceAccounts) {
            if (shouldStop) {
                console.log('stopped');
                break;
            }
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
                console.log('hasServiceAccount');
                continue;
            } else {
                noServiceAccountCompanies.push(company.id);
                console.log('!hasServiceAccount, created date:', company.created_at, company.id);
            }
            const hasAccountProfile = profiles?.find((p) => p.email_engine_account_id);

            const identifier = company.cus_id.toLowerCase().trim();
            const email = `support+${identifier}@boostbot.ai`;
            let id = '';

            // logic above is a mess. lets try refactoring
            const passwords = [process.env.SERVICE_ACCOUNT_PASSWORD ?? '', 'B00$t80t*Support', 'B00*Support'];

            for (const password of passwords) {
                const { error, data: signinResData } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                console.log({ signinResData, error });
                if (error) {
                    console.log('error signing in with old passwords', error, password);
                    // continue;
                }
                if (signinResData?.user?.id) {
                    id = signinResData?.user?.id;
                    break;
                }
            }
            console.log('id', id);
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
            try {
                const result = await db().insert(profilesSchema).values(profileBody).returning();

                console.log('created profile', result);
                results.push(company);
            } catch (error: any) {
                if (error.message.includes('duplicate key value violates unique constraint "profiles_pkey')) {
                    try {
                        const result = db()
                            .update(profilesSchema)
                            .set(profileBody)
                            .where(eq(profilesSchema.id, id))
                            .returning();
                        console.log('update profile', result);
                        results.push(company);
                    } catch (error) {
                        console.log('error updating profile');
                        console.error(error);
                    }
                } else {
                    console.log('error inserting');
                    console.error(error);
                }
            }
        }
    console.log('results', results);
    console.log('noServiceAccountCompanies', noServiceAccountCompanies);
    return res.json({ results });
};
const alreadyProcessed = [
    'support+cus_otpbpdkymr5qkn@boostbot.ai',
    'support+cus_nlffbksdhf7ka8@boostbot.ai',
    'support+cus_nrgsfnorl7g4fd@boostbot.ai',
    'support+cus_p2pg2grjjmdnyp@boostbot.ai',
    'support+cus_p2ule9jho9stmw@boostbot.ai',
    'support+cus_pahwgbrhns5sow@boostbot.ai',
    'support+cus_pai3mlcvaasyge@boostbot.ai',
    'support+cus_pazywljhtsx4kq@boostbot.ai',
    'support+cus_p2jycwasfuuxx2@boostbot.ai',
    'support+cus_p26qggzkeyg3fi@boostbot.ai',
    'support+cus_p3ibzbehljd8y6@boostbot.ai',
    'support+cus_p54umnzhbtamkj@boostbot.ai',
    'support+cus_paf3tbwwcalqer@boostbot.ai',
    'support+cus_pahgs9dndhmcve@boostbot.ai',
    'support+cus_otsb9x0n8efxtx@boostbot.ai',
    'support+cus_p3ygmfhgympdov@boostbot.ai',
    'support+cus_p3j1g0carkphab@boostbot.ai',
    'support+cus_p2tqb97yxy4xf2@boostbot.ai',
    'support+cus_p26v0rmpxmrmz0@boostbot.ai',
    'support+cus_p2tvxaruwjvxwq@boostbot.ai',
    'support+cus_p55qfdlilzmrxy@boostbot.ai',
    'support+cus_p29lgrev9xcf0b@boostbot.ai',
    'support+cus_paf4eesggqt36j@boostbot.ai',
    'support+cus_oxit0taaaqpfc4@boostbot.ai',
    'support+cus_p28ef3katg53dz@boostbot.ai',
    'support+cus_p4wo8xiid1kg4w@boostbot.ai',
    'support+cus_p2zs1c04bjpqqc@boostbot.ai',
    'support+cus_p0e4yjop3ytg1r@boostbot.ai',
    'support+cus_p3yqzeorv7joet@boostbot.ai',
    'support+cus_p2xdywgfdqlcbw@boostbot.ai',
    'support+cus_p2fqnjiuznage7@boostbot.ai',
    'support+cus_paf5ir7pmbw1xq@boostbot.ai',
    'support+cus_p2apvt3xu2vbhs@boostbot.ai',
    'support+cus_p55vmn0jbtbilz@boostbot.ai',
    'support+cus_paf6mcvhp9kg8a@boostbot.ai',
    'support+cus_paf8gm6mprxr74@boostbot.ai',
    'support+cus_p2miuu1wjf1kmm@boostbot.ai',
    'support+cus_p3ajbkknzdczr0@boostbot.ai',
    'support+cus_p3fzsm231lq5xn@boostbot.ai',
    'support+cus_paf7ab1jjmwqwa@boostbot.ai',
    'support+cus_p3yr2onaclwmvo@boostbot.ai',
    'support+cus_p2cxve8gvtdsyh@boostbot.ai',
    'support+cus_panl56nfzsq4hh@boostbot.ai',
    'support+cus_panmfjyinbencz@boostbot.ai',
    'support+cus_paf8c6zeklk7w9@boostbot.ai',
    'support+cus_panartqbpmgwig@boostbot.ai',
    'support+cus_npn12ukbhkwnde@boostbot.ai',
    'support+cus_p2dy7cuupbixgt@boostbot.ai',
    'support+cus_p2gect7vtgcwv4@boostbot.ai',
    'support+cus_p2hniwhruajkxt@boostbot.ai',
    'support+cus_p2b66egmukdmgy@boostbot.ai',
    'support+cus_noxsd1i7v3l1ne@boostbot.ai',
    'support+cus_nlcmguikvgld7c@boostbot.ai',
    'support+cus_nq2jhy08gwkrmj@boostbot.ai',
    'support+cus_npmdzb9vgyb8sn@boostbot.ai',
    'support+cus_np19yudywsnre9@boostbot.ai',
    'support+cus_nq6qra8kwwp6vz@boostbot.ai',
    'support+cus_nlbxnumpzft3rp@boostbot.ai',
    'support+cus_npqwa5i1w4aq68@boostbot.ai',
    'support+cus_p0xr1gnzrvpubr@boostbot.ai',
    'support+cus_p40kurfkvwmkij@boostbot.ai',
    'support+cus_nldkl7btc35swr@boostbot.ai',
    'support+cus_nlegedvz4l8uom@boostbot.ai',
    'support+cus_npo6eiosmnatij@boostbot.ai',
    'support+cus_ntviy5zucj0njd@boostbot.ai',
    'support+cus_nrasspyganchnn@boostbot.ai',
    'support+cus_p2u32tuvbkcvi3@boostbot.ai',
    'support+cus_pc0k3hawgmiyu6@boostbot.ai',
    'support+cus_pdryvbqqiwjzwb@boostbot.ai',
    'support+cus_pdhzxd0bhq1cyk@boostbot.ai',
    'support+cus_pdn5ia3l0vpgbf@boostbot.ai',
    'support+cus_penfqmdeizy8yo@boostbot.ai',
    'support+cus_pgoiueymszdodu@boostbot.ai',
    'support+cus_pgrp8xt0notdjm@boostbot.ai',
    'support+cus_ph7c808iwjg11z@boostbot.ai',
    'support+cus_nlbv66jowbyrnc@boostbot.ai',
    'support+cus_npnesgs9m4ks9r@boostbot.ai',
    'support+cus_nkce8jkclsn7ym@boostbot.ai',
    'support+cus_nmiwpyba2ild5o@boostbot.ai',
    'support+cus_nmnkiwozv4a1u7@boostbot.ai',
    'support+cus_nm31kgxjdbobdc@boostbot.ai',
    'support+cus_npmx7zzizrtazg@boostbot.ai',
    'support+cus_pbw6goeqa9pbro@boostbot.ai',
    'support+cus_pbrlncx8kdmjl1@boostbot.ai',
    'support+cus_pfyedrd5oww8ld@boostbot.ai',
    'support+cus_pfdjrqc5lnbb4l@boostbot.ai',
    'support+cus_pfxeblpenzzjxo@boostbot.ai',
    'support+cus_pj4iq87ijhlftm@boostbot.ai',
    'support+cus_p3bct6o4pcrq03@boostbot.ai',
    'support+cus_p2jcliyckiefxy@boostbot.ai',
    'support+cus_p583h28bthhuqw@boostbot.ai',
    'support+cus_peyfx79fccsncw@boostbot.ai',
    'support+cus_pfi9bc520qrxll@boostbot.ai',
    'support+cus_pfz6nfeudlygfj@boostbot.ai',
    'support+cus_pfenn2xqvu8umw@boostbot.ai',
    'support+cus_pgkxiwas93xig6@boostbot.ai',
    'support+cus_pgoqbkvqwen8js@boostbot.ai',
    'support+cus_pghwjgnxda4ixq@boostbot.ai',
    'support+cus_pgsnhcgvpp6mqd@boostbot.ai',
    'support+cus_np1k4bu71kf8qc@boostbot.ai',
    'support+cus_npnjzy2uoajnnx@boostbot.ai',
    'support+cus_nkxdz8xkacgtuu@boostbot.ai',
    'support+cus_nr0nsftx3edgde@boostbot.ai',
    'support+cus_nqq6wqcmghqjau@boostbot.ai',
    'support+cus_ntqrw5pzxfmir1@boostbot.ai',
    'support+cus_nrguowqggqjwzh@boostbot.ai',
    'support+cus_p2xonujs7fz0xe@boostbot.ai',
    'support+cus_p3orskvr25gsy1@boostbot.ai',
    'support+cus_p2vdkam3afpdeg@boostbot.ai',
    'support+cus_oxmnwuushxyaep@boostbot.ai',
    'support+cus_pfetyeqd4cqpjv@boostbot.ai',
    'support+cus_pb0emjsrsczzvt@boostbot.ai',
    'support+cus_pdutvzcvdeoscj@boostbot.ai',
    'support+cus_pbbftbg3g6vyp0@boostbot.ai',
    'support+cus_pdo7f1ztlaxcqu@boostbot.ai',
    'support+cus_phco59qm7inaes@boostbot.ai',
    'support+cus_piysijqpdghs7v@boostbot.ai',
    'support+cus_nlce5rcgdmmfts@boostbot.ai',
    'support+cus_np3l4dqegbz3b4@boostbot.ai',
    'support+cus_noyvzzc17xfpnn@boostbot.ai',
    'support+cus_nozendrvv7dcnl@boostbot.ai',
    'support+cus_np13qzqzbqjh64@boostbot.ai',
    'support+cus_nqnnlvsmmmkeg6@boostbot.ai',
    'support+cus_nrftzgtjs0uzz4@boostbot.ai',
    'support+cus_p2ztuxeoscqaqq@boostbot.ai',
    'support+cus_p2ug1opychjyob@boostbot.ai',
    'support+cus_p40mjmwpwz50xn@boostbot.ai',
    'support+cus_p2zabqmsrl3olo@boostbot.ai',
    'support+cus_p3iartcv0ikelu@boostbot.ai',
    'support+cus_pd2jd82ifsxwak@boostbot.ai',
    'support+cus_pdnuzloy0re44s@boostbot.ai',
    'support+cus_pdnwc1l3vnqzzx@boostbot.ai',
    'support+cus_pbbeynw1gvaavo@boostbot.ai',
    'support+cus_pe4b7nznrd49af@boostbot.ai',
    'support+cus_pe9iflwup4sxr9@boostbot.ai',
    'support+cus_peusimr8235wna@boostbot.ai',
    'support+cus_peuurzrbyzhybx@boostbot.ai',
    'support+cus_pcwsx8p0edz9de@boostbot.ai',
    'support+cus_pdnkjxnbub9kb6@boostbot.ai',
    'support+cus_phhr8cooukg9eh@boostbot.ai',
    'support+cus_pifxyfnleinqkh@boostbot.ai',
    'support+cus_npgzab4kgoy884@boostbot.ai',
    'support+cus_oy0zwslhhut869@boostbot.ai',
    'support+cus_p407xfci7h59se@boostbot.ai',
    'support+cus_p2gyg2tyeez72x@boostbot.ai',
    'support+cus_p3gbnn09goqan0@boostbot.ai',
    'support+cus_p2mjpmgi88w1ro@boostbot.ai',
    'support+cus_p2pckca3yzhlx6@boostbot.ai',
    'support+cus_pfmyqkr4vwlzi8@boostbot.ai',
    'support+cus_pd32sgqhc94wpb@boostbot.ai',
    'support+cus_pdtxbamkbf3q01@boostbot.ai',
    'support+cus_peyp1vygooswpy@boostbot.ai',
    'support+cus_p3danaa21tb14n@boostbot.ai',
    'support+cus_pakoe8ckben2xg@boostbot.ai',
    'support+cus_pbrnoaorrrftue@boostbot.ai',
    'support+cus_pbrpuaqzmgd5lh@boostbot.ai',
    'support+cus_pcbuqiqtdjxzzv@boostbot.ai',
    'support+cus_pcsbimvh9tvc9g@boostbot.ai',
    'support+cus_pdidut9kamg85k@boostbot.ai',
    'support+cus_pix61u95ezgix1@boostbot.ai',
    'support+cus_pjjqykaj61rhip@boostbot.ai',
    'support+cus_omw6bn1qhv6f3n@boostbot.ai',
    'support+cus_nlzwujghis4ngw@boostbot.ai',
    'support+cus_np3sloeiiuvcwc@boostbot.ai',
    'support+cus_npmigl5cftfi5o@boostbot.ai',
    'support+cus_npmjvf7wqbtdpc@boostbot.ai',
    'support+cus_nre52esnmjnhfh@boostbot.ai',
    'support+cus_piysaqkp7sgmya@boostbot.ai',
    'support+cus_nq3qsehjnchnyq@boostbot.ai',
    'support+cus_nrh1sfbknxhi3i@boostbot.ai',
    'support+cus_nuyhtmxkf1f3el@boostbot.ai',
    'support+cus_ntvvwxa25oegyz@boostbot.ai',
    'support+cus_nuvyplgf7tlhbe@boostbot.ai',
    'support+cus_nxwontytrx2ech@boostbot.ai',
    'support+cus_ncunvxsrviurjc@boostbot.ai',
    'support+cus_nlq3bhlgjykxbc@boostbot.ai',
    'support+cus_nmaqu5xnxzumti@boostbot.ai',
    'support+cus_peygfzcg2bbk4v@boostbot.ai',
    'support+cus_nqnv8hcz5xclb6@boostbot.ai',
    'support+cus_pfa2cwmbrwyimk@boostbot.ai',
    'support+cus_paks1ir512u4uo@boostbot.ai',
    'support+cus_pajrts3js1g2pg@boostbot.ai',
    'support+cus_pbx2ug4gbekqmj@boostbot.ai',
    'support+cus_pe4in2ijyd83nf@boostbot.ai',
    'support+cus_peanmcymyemu5m@boostbot.ai',
    'support+cus_pgmunivgs6q9uh@boostbot.ai',
    'support+cus_pgkmqboj3ar2bu@boostbot.ai',
    'support+cus_ph7cbncnqd6f4c@boostbot.ai',
    'support+cus_pj51p2nhjmtrnz@boostbot.ai',
    'support+cus_pjiyonj5bgbm8i@boostbot.ai',
    'support+cus_pjqi98y8shwyqf@boostbot.ai',
    'support+cus_pjh8tdqqw6mfz8@boostbot.ai',
    'support+cus_ot9wn5pm04r67e@boostbot.ai',
    'support+cus_npoe2ag9zv5cle@boostbot.ai',
    'support+cus_npos1zxbk391et@boostbot.ai',
    'support+cus_nqvrvzotloq1c5@boostbot.ai',
    'support+cus_npmg7dtlhyaukq@boostbot.ai',
    'support+cus_nqpb8mlvmoqrbf@boostbot.ai',
    'support+cus_nsndot7kctguxd@boostbot.ai',
    'support+cus_nsvaq0hz30khg2@boostbot.ai',
    'support+cus_nrvcufikx0tlgo@boostbot.ai',
    'support+cus_ntd5vqeikkncqs@boostbot.ai',
    'support+cus_p3di9cdr1cfxe8@boostbot.ai',
    'support+cus_ntpkngy3wj1ot7@boostbot.ai',
    'support+cus_nuo4oqobmwiz7y@boostbot.ai',
    'support+cus_ntwlc1h28ggegr@boostbot.ai',
    'support+cus_nux1bhqtgietzl@boostbot.ai',
    'support+cus_nwbbpwzmbaroj9@boostbot.ai',
    'support+cus_nwsw3p8l4gnrry@boostbot.ai',
    'support+cus_nywvadybd3yln8@boostbot.ai',
    'support+cus_nie16yfo5pepsf@boostbot.ai',
    'support+cus_nrgb16q1zwj1bm@boostbot.ai',
    'support+cus_ntkku6xcrqv4bc@boostbot.ai',
    'support+cus_ngzpp4lhwz3s0d@boostbot.ai',
    'support+cus_nwqvh9pma11ieq@boostbot.ai',
    'support+cus_nhkdbttlhvq8f7@boostbot.ai',
    'support+cus_nuqhwepts0370f@boostbot.ai',
    'support+cus_pg1vrhrrdnujip@boostbot.ai',
    'support+cus_ots9qarlmtcfpo@boostbot.ai',
    'support+cus_nhfrdpezrvpi6n@boostbot.ai',
    'support+cus_nr9surdflvnusb@boostbot.ai',
    'support+cus_nvh8w70rkk0vfi@boostbot.ai',
    'support+cus_nrgucr3h2wkkit@boostbot.ai',
    'support+cus_nw7abadodagxlv@boostbot.ai',
    'support+cus_nratx1ypenjlpu@boostbot.ai',
    'support+cus_nraecahikhgzl4@boostbot.ai',
    'support+cus_nucfhrs6zg5gjz@boostbot.ai',
    'support+cus_nrebq2n1dggewc@boostbot.ai',
    'support+cus_otbrcx14thxuxf@boostbot.ai',
    'support+cus_nsdhosff7oc9va@boostbot.ai',
    'support+cus_nrfjdhltvmp9zn@boostbot.ai',
    'support+cus_nruyfhmwozwlvi@boostbot.ai',
    'support+cus_nrx43qnakv2jno@boostbot.ai',
    'support+cus_nsnf3tux75kvcg@boostbot.ai',
    'support+cus_nt75vhynsxj9rq@boostbot.ai',
    'support+cus_ntug4uelzk4sl9@boostbot.ai',
    'support+cus_ntvctvubzs9jrr@boostbot.ai',
    'support+cus_nqp8umcytmzsew@boostbot.ai',
    'support+cus_ngxyqfn6zihcyn@boostbot.ai',
    'support+cus_nv0rg0jmekg1pi@boostbot.ai',
    'support+cus_nv12ffz8nbuwwg@boostbot.ai',
    'support+cus_nv2dtx5veflie4@boostbot.ai',
    'support+cus_nw8amrpyg6vwka@boostbot.ai',
    'support+cus_nwrlbvoorlnrfp@boostbot.ai',
    'support+cus_ohtu3oh1zxf2uo@boostbot.ai',
    'support+cus_ohtep7boom06tj@boostbot.ai',
    'support+cus_ojmnpapnjcnyuz@boostbot.ai',
    'support+cus_olfvpasngdej2i@boostbot.ai',
    'support+cus_omj7xxhfsckurt@boostbot.ai',
    'support+cus_oxpwsfl9btvs7d@boostbot.ai',
    'support+cus_p1wr42wncb1ovr@boostbot.ai',
    'support+cus_osrm5ssov8bp9o@boostbot.ai',
    'support+cus_oy29nrquhu6did@boostbot.ai',
    'support+cus_osg9uy14rng6pb@boostbot.ai',
    'support+cus_olanukhtmse34x@boostbot.ai',
    'support+cus_ohtwe84pzpw0yp@boostbot.ai',
    'support+cus_ohb24ovjyym275@boostbot.ai',
    'support+cus_oidlmcefqpmzel@boostbot.ai',
    'support+cus_oj5cviwsqjkart@boostbot.ai',
    'support+cus_ol1ieiz3nd5mhr@boostbot.ai',
    'support+cus_omrcx8viazbujk@boostbot.ai',
    'support+cus_otvbtcawz6hrwq@boostbot.ai',
    'support+cus_omluz4eglazskw@boostbot.ai',
    'support+cus_ominys9f771cou@boostbot.ai',
    'support+cus_oxftjcpqjzxmjk@boostbot.ai',
    'support+cus_oylqki2fqukpdj@boostbot.ai',
    'support+cus_p0bdmjs8lvmxru@boostbot.ai',
    'support+cus_p0gawwi9mtwuap@boostbot.ai',
    'support+cus_p0yyowdlcmcyul@boostbot.ai',
    'support+cus_oxfx1xozckizhw@boostbot.ai',
    'support+cus_ozoizx9eykg7gb@boostbot.ai',
    'support+cus_owbusjesgdw2lf@boostbot.ai',
    'support+cus_ovj30h2edmrxh8@boostbot.ai',
    'support+cus_p1nt9xdyylqviq@boostbot.ai',
    'support+cus_osswl5dwdc04x9@boostbot.ai',
    'support+cus_oxr16u90be4cja@boostbot.ai',
    'support+cus_oy2mwrhsh8ggxc@boostbot.ai',
    'support+cus_oygyzrq0imd56h@boostbot.ai',
    'support+cus_paqfdopnve8bqw@boostbot.ai',
    'support+cus_pbvwkfsl88xy6r@boostbot.ai',
    'support+cus_ohzgqfc2omwfwo@boostbot.ai',
    'support+cus_ovksqu712cfoks@boostbot.ai',
    'support+cus_ovlpzm5pquh992@boostbot.ai',
    'support+cus_oqsbwxnskbolft@boostbot.ai',
    'support+cus_oymc2lj9jfzman@boostbot.ai',
    'support+cus_p16yktzvkr7gq6@boostbot.ai',
    'support+cus_oxzzmy9fq2scsa@boostbot.ai',
    'support+cus_oxdodlohp5cyb7@boostbot.ai',
    'support+cus_ozwab7fschwesc@boostbot.ai',
    'support+cus_obskepogcl3egn@boostbot.ai',
    'support+cus_ovknbz1uglvvyj@boostbot.ai',
    'support+cus_oglyz0kmlvhggv@boostbot.ai',
    'support+cus_ogyqet7bq2mgff@boostbot.ai',
    'support+cus_ovnojcbu2ef66t@boostbot.ai',
    'support+cus_nudshfizcala8g@boostbot.ai',
    'support+cus_nwthqhqj0cs5qb@boostbot.ai',
    'support+cus_nwueavyjjn2bac@boostbot.ai',
    'support+cus_nwuf0htblfrqy1@boostbot.ai',
    'support+cus_ny78lj5vkdyrza@boostbot.ai',
    'support+cus_otcppd4pdcxexq@boostbot.ai',
    'support+cus_nz9nc4vmoc4a85@boostbot.ai',
    'support+cus_ncmogmvf4lkzl7@boostbot.ai',
    'support+cus_p3j3pprb9urack@boostbot.ai',
    'support+cus_p2ytvv6n1cw7my@boostbot.ai',
    'support+cus_p57dynteuvygst@boostbot.ai',
    'support+cus_nyldxdpia3wcdi@boostbot.ai',
    'support+cus_nbmgv9ae1hz7u6@boostbot.ai',
    'support+cus_ngd8j6mrutvomk@boostbot.ai',
    'support+cus_nmdzqodk1nvdlv@boostbot.ai',
    'support+cus_ntmemv99jojplu@boostbot.ai',
    'support+cus_nnhacnpfzpzhry@boostbot.ai',
    'support+cus_pbqn1ff4j8igtf@boostbot.ai',
    'support+cus_pbxmyxnpef1wvf@boostbot.ai',
    'support+cus_ouelexfvcuyerj@boostbot.ai',
    'support+cus_pcflxsxterd8op@boostbot.ai',
    'support+cus_pcemop62ic81gn@boostbot.ai',
    'support+cus_naaihrse5shu8m@boostbot.ai',
    'support+cus_nkjgrkylg6uysc@boostbot.ai',
    'support+cus_pcxzu9flblv87g@boostbot.ai',
    'support+cus_pb4zgapezsvw6e@boostbot.ai',
    'support+cus_pgkzql3u3jpq3i@boostbot.ai',
    'support+cus_ots1owmqybn7fc@boostbot.ai',
    'support+cus_pevnei6xufuqar@boostbot.ai',
    'support+cus_outcdr4vus5pps@boostbot.ai',
    'support+cus_o7x67l0yphokff@boostbot.ai',
    'support+cus_oct0al7wbi2kiz@boostbot.ai',
    'support+cus_ozubmk0hid3cow@boostbot.ai',
    'support+cus_otetvh4sg1flx3@boostbot.ai',
    'support+cus_otsr2lkvj007qq@boostbot.ai',
    'support+cus_p2peuta8znbkjz@boostbot.ai',
    'support+cus_pcwv8ymxkcigsx@boostbot.ai',
    'support+cus_pdivaczj5bwbbl@boostbot.ai',
    'support+cus_peuddcr4kalsgr@boostbot.ai',
    'support+cus_nz1z4pmaipfvuy@boostbot.ai',
    'support+cus_nblhs3d8rbcf32@boostbot.ai',
    'support+cus_ncol6j1qddodso@boostbot.ai',
    'support+cus_nfq9o8quabohtm@boostbot.ai',
    'support+cus_nlrvqpwp4xw6qc@boostbot.ai',
    'support+cus_pbscnlsvprel54@boostbot.ai',
    'support+cus_pe6ezfvitujaxd@boostbot.ai',
    'support+cus_ots2olvdwcewas@boostbot.ai',
    'support+cus_nfqlgmxnhi79iu@boostbot.ai',
    'support+cus_pbu56vvrr4xmji@boostbot.ai',
    'support+cus_pcla0mbil6jzyd@boostbot.ai',
    'support+cus_pcfszwynolgrp1@boostbot.ai',
    'support+cus_pd62r1eibgpplc@boostbot.ai',
    'support+cus_pamt4mhq00ndpc@boostbot.ai',
    'support+cus_pfn0vuup2txngb@boostbot.ai',
    'support+cus_pfaois9jnc7agc@boostbot.ai',
    'support+cus_ph7ytxc4kls6ke@boostbot.ai',
    'support+cus_phuthq3hiezwdj@boostbot.ai',
    'support+cus_p2vlhctfygcdyk@boostbot.ai',
    'support+cus_nmzmvistzsmg12@boostbot.ai',
    'support+cus_pdkuxqs7ivdvmc@boostbot.ai',
    'support+cus_pe7kindu8zc5qh@boostbot.ai',
    'support+cus_phvp7f7wcpzgsj@boostbot.ai',
    'support+cus_otuvhpknfqzrcv@boostbot.ai',
    'support+cus_pamyqipgzifmsw@boostbot.ai',
    'support+cus_o3pz2bkavn97ed@boostbot.ai',
    'support+cus_ozv60zupgmzqpc@boostbot.ai',
    'support+cus_p2caicb69jzio4@boostbot.ai',
    'support+cus_panhinghkxtoxr@boostbot.ai',
    'support+cus_pbrpxl2kqd3gns@boostbot.ai',
    'support+cus_oucyz7c6o1llb5@boostbot.ai',
    'support+cus_pbz5bthf9kcuul@boostbot.ai',
    'support+cus_pbv3jh8lujytsy@boostbot.ai',
    'support+cus_o2jdzfnakysgki@boostbot.ai',
    'support+cus_odwwlusxydkmeo@boostbot.ai',
    'support+cus_pafdjckcpvjci2@boostbot.ai',
    'support+cus_ova9dylt4t2b7h@boostbot.ai',
    'support+cus_ovmjbwavoftdxi@boostbot.ai',
    'support+cus_nveehemvxuoxvp@boostbot.ai',
    'support+cus_p1churcahahvdi@boostbot.ai',
    'support+cus_p1ht6fzwvbuccc@boostbot.ai',
    'support+cus_ovkecm1cqcdb9t@boostbot.ai',
    'support+cus_ouzlahtpzazvpf@boostbot.ai',
    'support+cus_ov89d3tpe9tguw@boostbot.ai',
    'support+cus_oxyzxibjy8ywz3@boostbot.ai',
    'support+cus_oxy1uewau011ws@boostbot.ai',
    'support+cus_pb8jbm5kgjgept@boostbot.ai',
    'support+cus_p1xceu17jrycoo@boostbot.ai',
    'support+cus_ozukpg45z2makn@boostbot.ai',
    'support+cus_p1r0nuvzqbfumd@boostbot.ai',
    'support+cus_p1ielwgfqcuzhj@boostbot.ai',
    'support+cus_oxmqdl1xnfdayx@boostbot.ai',
    'support+cus_ouy7da65qy43c7@boostbot.ai',
    'support+cus_pbuu1u7vd1ufgl@boostbot.ai',
    'support+cus_pdqfgcvtb0ux2u@boostbot.ai',
    'support+cus_ouqzbh70hl9pup@boostbot.ai',
    'support+cus_ov5vva9ccmqzin@boostbot.ai',
    'support+cus_ovq48ihbuoxbsc@boostbot.ai',
    'support+cus_ovali5pcvyjgtu@boostbot.ai',
    'support+cus_ovsqrwxexcpc7h@boostbot.ai',
    'support+cus_oybxkct8c1hvhq@boostbot.ai',
    'support+cus_oxpacatezbvpqo@boostbot.ai',
    'support+cus_otzctt4yl3flgr@boostbot.ai',
    'support+cus_oy0zsmbmyrhdfu@boostbot.ai',
    'support+cus_oyprd76asa1fpv@boostbot.ai',
    'support+cus_p07pftgkmt8pvq@boostbot.ai',
    'support+cus_owzyp5l6bi9ih6@boostbot.ai',
    'support+cus_ot8maua2x2j1zf@boostbot.ai',
    'support+cus_oxqjygfprs4pqw@boostbot.ai',
    'support+cus_ovjqfxjophgjgc@boostbot.ai',
    'support+cus_p2rbxkh9yqmrrk@boostbot.ai',
    'support+cus_og370e929now8z@boostbot.ai',
    'support+cus_p1wmgnshyzic8f@boostbot.ai',
    'support+cus_ovp5qv3hyxdrif@boostbot.ai',
    'support+cus_ozxv1crx4c5olk@boostbot.ai',
    'support+cus_oypi54wgav3zda@boostbot.ai',
    'support+cus_p0xdpqzutaqqtz@boostbot.ai',
    'support+cus_p40fwesynqsbws@boostbot.ai',
    'support+cus_owbiuksse6eh57@boostbot.ai',
    'support+cus_p3dnatwj7fpmr1@boostbot.ai',
    'support+cus_ov4pcjd6ckr8ld@boostbot.ai',
    'support+cus_oxfaijfu3dikqq@boostbot.ai',
    'support+cus_oxgvxqtsude0c8@boostbot.ai',
    'support+cus_oyptml0jp07eae@boostbot.ai',
    'support+cus_ow5y7slragstxx@boostbot.ai',
    'support+cus_oxd2o61fiuknav@boostbot.ai',
    'support+cus_oskslydgchxbat@boostbot.ai',
    'support+cus_osm4uvsepcluoe@boostbot.ai',
    'support+cus_osmjdkejamv50n@boostbot.ai',
    'support+cus_oxhclirsqvxxby@boostbot.ai',
    'support+cus_ot6bvheskonugh@boostbot.ai',
    'support+cus_oym68jtoyh8gjv@boostbot.ai',
    'support+cus_p0zct8c5j1t9rp@boostbot.ai',
    'support+cus_p1oewmyam1f5va@boostbot.ai',
    'support+cus_oxziu5zs0xnbgr@boostbot.ai',
    'support+cus_oyhvxv8klwuhes@boostbot.ai',
    'support+cus_p1vvuloxujzu42@boostbot.ai',
    'support+cus_p1pxkzat4vy0iv@boostbot.ai',
    'support+cus_oyors6v9dvujgn@boostbot.ai',
    'support+cus_p2vhx3zqal0j1v@boostbot.ai',
    'support+cus_oihakywk7i7dyt@boostbot.ai',
    'support+cus_oiuu6hxrqrzwhw@boostbot.ai',
    'support+cus_oly3qkhsgkfi39@boostbot.ai',
    'support+cus_oxbwshjdfjfwdd@boostbot.ai',
    'support+cus_olquyfizcba98p@boostbot.ai',
    'support+cus_p1t9wzoyjys7ej@boostbot.ai',
    'support+cus_oyhyujjh3akbwh@boostbot.ai',
    'support+cus_oykym2bnhj4qlu@boostbot.ai',
    'support+cus_ornmn0aiw6bemz@boostbot.ai',
    'support+cus_opiopsnm1rbuqb@boostbot.ai',
    'support+cus_oqtkzy6xhft9da@boostbot.ai',
    'support+cus_osramb2kfxstl4@boostbot.ai',
    'support+cus_p1diye5kf1dwth@boostbot.ai',
    'support+cus_oxf52zym7dlfbq@boostbot.ai',
    'support+cus_oamgwvhepepbnq@boostbot.ai',
    'support+cus_paogea1iada7jn@boostbot.ai',
    'support+cus_paofljodc7uvs0@boostbot.ai',
    'support+cus_ovwfz5lzc0wosq@boostbot.ai',
    'support+cus_ouj0nzc057uavp@boostbot.ai',
    'support+cus_ov3jrknr6ftwah@boostbot.ai',
    'support+cus_ov6pylam0h4t3k@boostbot.ai',
    'support+cus_ov78exjo5m2hlj@boostbot.ai',
    'support+cus_oxnlx1ojpv0u3t@boostbot.ai',
    'support+cus_oxb11g9ifraz9j@boostbot.ai',
    'support+cus_oa61uahk5lnaaj@boostbot.ai',
    'support+cus_ovag0vkeuhlojs@boostbot.ai',
    'support+cus_p2r0tccfrrstxu@boostbot.ai',
    'support+cus_oy3scr4unzvnsn@boostbot.ai',
    'support+cus_p0gc9jtushfqqv@boostbot.ai',
    'support+cus_ovgyldxiczu2c0@boostbot.ai',
    'support+cus_p1afpjjqppxvhr@boostbot.ai',
    'support+cus_piws5mokafd6r1@boostbot.ai',
    'support+cus_pe7wdbxhbob2st@boostbot.ai',
    'support+cus_pewzzhy7hkghky@boostbot.ai',
    'support+cus_pjkj9v0gv0utnt@boostbot.ai',
    'support+cus_ouaoyd6fm9zr4d@boostbot.ai',
    'support+cus_pbvxcv04nofqod@boostbot.ai',
    'support+cus_pdjk0g4190zsw5@boostbot.ai',
    'support+cus_pdql63pvfdsuuf@boostbot.ai',
    'support+cus_peexiad6mdjszt@boostbot.ai',
    'support+cus_pewbfr3ruiizve@boostbot.ai',
    'support+cus_pbytrnegtkicaz@boostbot.ai',
    'support+cus_pjj7wlwizywmv2@boostbot.ai',
    'support+cus_ohxyheu3idja27@boostbot.ai',
    'support+cus_oufxtpysf90snl@boostbot.ai',
    'support+cus_pb8g79xr65ych0@boostbot.ai',
    'support+cus_pbcuykflgz6hn1@boostbot.ai',
    'support+cus_peq4gci8afsbmk@boostbot.ai',
    'support+cus_peq7mnl0c0bje2@boostbot.ai',
    'support+cus_pfcyt6xjjyqi0n@boostbot.ai',
    'support+cus_pgmymzhg8r9ufj@boostbot.ai',
    'support+cus_pgovk1hxv4umln@boostbot.ai',
    'support+cus_ph93mzaslrbl0d@boostbot.ai',
    'support+cus_piom6iwprbiu65@boostbot.ai',
    'support+cus_pixlo1xpirntau@boostbot.ai',
    'support+cus_ouf1rkcbwxxsl8@boostbot.ai',
    'support+cus_ocln9mwnlkwvxi@boostbot.ai',
    'support+cus_pg84r6slcjdqno@boostbot.ai',
    'support+cus_p9iupfi9irtfqv@boostbot.ai',
    'support+cus_paq8fapkyxagt1@boostbot.ai',
    'support+cus_pbv9ocqodcx6ge@boostbot.ai',
    'support+cus_pd11uzntuaqb3u@boostbot.ai',
    'support+cus_pdzlraa1rn7pir@boostbot.ai',
    'support+cus_pdlbabudcqsaia@boostbot.ai',
    'support+cus_pe2wgrpv2fpdon@boostbot.ai',
    'support+cus_pe81gcguphmbxd@boostbot.ai',
    'support+cus_picobljxkhzoze@boostbot.ai',
    'support+cus_pj9zt4zupxm675@boostbot.ai',
    'support+cus_pji7yzxdpxplep@boostbot.ai',
    'support+cus_pjj0zhf7sltjmn@boostbot.ai',
    'support+cus_pjofiuewhmlajn@boostbot.ai',
    'support+cus_pfcxaqwqjj6oh7@boostbot.ai',
    'support+cus_pavoiqdzsrp7xn@boostbot.ai',
    'support+cus_paluqwvsanztwp@boostbot.ai',
    'support+cus_phbyjewkteihu7@boostbot.ai',
    'support+cus_pj1t5o4xdh3lzx@boostbot.ai',
    'support+cus_odosygkgwiz6pq@boostbot.ai',
    'support+cus_ov3kpmrn6xny8w@boostbot.ai',
    'support+cus_ohsglzjymwbotl@boostbot.ai',
    'support+cus_oip6vyhgam0yzj@boostbot.ai',
    'support+cus_owvxtci1znflty@boostbot.ai',
    'support+cus_ovot08maupdedr@boostbot.ai',
    'support+cus_p1rzuzh3q1qsai@boostbot.ai',
    'support+cus_p1zrhibo63vcns@boostbot.ai',
    'support+cus_p1jt2hzg8idhmq@boostbot.ai',
    'support+cus_p2sut5byceduuz@boostbot.ai',
    'support+cus_p3pdupd54nzieg@boostbot.ai',
    'support+cus_p2pnbtl3f8lzq6@boostbot.ai',
    'support+cus_p3emy2surj9e69@boostbot.ai',
    'support+cus_p3oldxug5x1etr@boostbot.ai',
    'support+cus_p3v7dmlgx5khft@boostbot.ai',
    'support+cus_p5b28ftrzalpwz@boostbot.ai',
    'support+cus_p1xoaaxn1vixff@boostbot.ai',
    'support+cus_oqb13a8n6vl22z@boostbot.ai',
    'support+cus_p0fl8q2zcyewcl@boostbot.ai',
    'support+cus_p0xybbqi4bb0sm@boostbot.ai',
    'support+cus_p11jok4byeelkl@boostbot.ai',
    'support+cus_p1vayrokuyavv1@boostbot.ai',
    'support+cus_osyrlahahn6nza@boostbot.ai',
    'support+cus_osmkffnoouxl6q@boostbot.ai',
];

const loginFailed = [
    'support+cus_ohrgnsb1unmlrf@boostbot.ai',
    'support+cus_oiekoyb2fxyo3o@boostbot.ai',
    'support+cus_ogql2hjcwskqna@boostbot.ai',
    'support+cus_ogxqnbh5cthwfn@boostbot.ai',
    'support+cus_ohsatj7wis04a6@boostbot.ai',
    'support+cus_odnk50q5zfzxx4@boostbot.ai',
    'support+cus_oiwkxk4gza88js@boostbot.ai',
    'support+cus_om1jicciw3hbmp@boostbot.ai',
    'support+cus_okwwjuqmu1lkij@boostbot.ai',
    'support+cus_omkftsqeip2rha@boostbot.ai',
    'support+cus_on9txq9ggkcskp@boostbot.ai',
    'support+cus_oxup67twb4gp6b@boostbot.ai',
    'support+cus_onuj5mmossysbz@boostbot.ai',
    'support+cus_oujaxocphwlzno@boostbot.ai',
    'support+cus_p0kktjxghunwnv@boostbot.ai',
    'support+cus_ow5bnycgk9gow2@boostbot.ai',
    'support+cus_p1lygdtv4mdb9o@boostbot.ai',
    'support+cus_oq9udzxbm2orpw@boostbot.ai',
    'support+cus_oq9w4l9xks7umg@boostbot.ai',
    'support+cus_opmmgkwksmutfv@boostbot.ai',
    'support+cus_ozajfdoobfn35s@boostbot.ai',
    'support+cus_oa48cwapwctxcs@boostbot.ai',
    'support+cus_oygurxvna5jvki@boostbot.ai',
    'support+cus_oy4rcnw3ibd59w@boostbot.ai',
    'support+cus_p0bzojxgvzoqia@boostbot.ai',
    'support+cus_p0n8vh3fw7ygs9@boostbot.ai',
    'support+cus_ostswxxjoosh8i@boostbot.ai',
    'support+cus_p2pffuqtng7axq@boostbot.ai',
    'support+cus_oxfj9b89telixj@boostbot.ai',
    'support+cus_p3dyqsh7as4ovl@boostbot.ai',
    'support+cus_ozowbnqdweubw3@boostbot.ai',
    'support+cus_p11jpa4z4wuyzw@boostbot.ai',
    'support+cus_oxi55gnmzdkebd@boostbot.ai',
    'support+cus_oxgdlsa5p9jeu0@boostbot.ai',
    'support+cus_oxjik6adzytmgs@boostbot.ai',
    'support+cus_oxduvld64qnqhe@boostbot.ai',
    'support+cus_oy5hmmjrklnuf4@boostbot.ai',
    'support+cus_p12clevr0dqded@boostbot.ai',
    'support+cus_p1wytpbzgc14sz@boostbot.ai',
    'support+cus_p1fmqjotyub8nv@boostbot.ai',
    'support+cus_oycozujwljtbci@boostbot.ai',
    'support+cus_oxvvrvhj1zujdn@boostbot.ai',
    'support+cus_omog9uvbx55gmu@boostbot.ai',
    'support+cus_p5apeldam4lsxb@boostbot.ai',
    'support+cus_onep6vmmzlfamw@boostbot.ai',
    'support+cus_opnu1y54wjgqih@boostbot.ai',
    'support+cus_ophrwfsi2utkut@boostbot.ai',
    'support+cus_oryznknaavxvz9@boostbot.ai',
    'support+cus_oqbqxfhpix54z8@boostbot.ai',
    'support+cus_orepfmdam6typq@boostbot.ai',
    'support+cus_os1drc8vl16ht7@boostbot.ai',
    'support+cus_oxyuektsknjose@boostbot.ai',
    'support+cus_oxcpehmjmwtbol@boostbot.ai',
    'support+cus_oy3gvors81ysqy@boostbot.ai',
    'support+cus_ostbimyse2fde9@boostbot.ai',
    'support+cus_p3jzay3e0n1nap@boostbot.ai',
    'support+cus_osqhqntja9isfd@boostbot.ai',
    'support+cus_ow6asiit8jb6qx@boostbot.ai',
    'support+cus_oyongzgdqqrrtf@boostbot.ai',
    'support+cus_p0dc7dyo6yoslc@boostbot.ai',
    'support+cus_p0giebzcrtpopi@boostbot.ai',
    'support+cus_oy0onqanmuirqc@boostbot.ai',
    'support+cus_oufdzkxdmmz613@boostbot.ai',
    'support+cus_oh9jxgorv7qakj@boostbot.ai',
    'support+cus_ohcvydcddeioao@boostbot.ai',
    'support+cus_ohwovux6ay4kg7@boostbot.ai',
    'support+cus_oigl4mkwxmx7fr@boostbot.ai',
    'support+cus_ok7ylp9s1k2j6u@boostbot.ai',
    'support+cus_okph3bqioqfg6z@boostbot.ai',
    'support+cus_omlxddfimevniw@boostbot.ai',
    'support+cus_olbhaubmoxww3b@boostbot.ai',
    'support+cus_olx7bytrndw2iy@boostbot.ai',
    'support+cus_omkxs9fx7uz0qj@boostbot.ai',
    'support+cus_omi9wgzxe9afba@boostbot.ai',
    'support+cus_omoblmgnedluue@boostbot.ai',
    'support+cus_owwi2mgyjwhmtj@boostbot.ai',
    'support+cus_omk9axshzvyg77@boostbot.ai',
    'support+cus_ovi4paaazbmaht@boostbot.ai',
    'support+cus_oxz6tlub0hurk6@boostbot.ai',
    'support+cus_p10dvbt3moy2zw@boostbot.ai',
    'support+cus_p15wzfrzsq6jyh@boostbot.ai',
    'support+cus_onupdygbgzxsrc@boostbot.ai',
    'support+cus_oxzkverzmxzsun@boostbot.ai',
    'support+cus_oyl5ff16sn0db6@boostbot.ai',
    'support+cus_ovtjiiraz8j2fr@boostbot.ai',
    'support+cus_p1tfw5kh9byzmz@boostbot.ai',
    'support+cus_osm0itjbv1c003@boostbot.ai',
    'support+cus_osmmrrftwz8df8@boostbot.ai',
    'support+cus_oy02irdniay3ip@boostbot.ai',
    'support+cus_oy5cp833plhxzl@boostbot.ai',
    'support+cus_ovjv88stg5izd1@boostbot.ai',
    'support+cus_ogoj20urstocbf@boostbot.ai',
    'support+cus_oimxapq6f61r6r@boostbot.ai',
    'support+cus_ojrouum1ck9kza@boostbot.ai',
    'support+cus_okdewmkvouq8lw@boostbot.ai',
    'support+cus_okxw0ta4jtlzqf@boostbot.ai',
    'support+cus_omwqe7ppqopyrg@boostbot.ai',
    'support+cus_on9s6j12osk1md@boostbot.ai',
    'support+cus_on9s04trt2ucxs@boostbot.ai',
    'support+cus_oxnlsgxwuatzv9@boostbot.ai',
    'support+cus_ovi8zb31nm8tae@boostbot.ai',
    'support+cus_oxf9zzsvmq7yt1@boostbot.ai',
    'support+cus_p2vnoctizehope@boostbot.ai',
    'support+cus_oxzmavxyeye6zk@boostbot.ai',
    'support+cus_ovmjbwavoftdxi@boostbot.ai',
    'support+cus_nveehemvxuoxvp@boostbot.ai',
    'support+cus_pbujev4xoacv9m@boostbot.ai',
    'support+cus_pbrmeon2gr1ggx@boostbot.ai',
    'support+cus_pgmvjck1c5vfby@boostbot.ai',
    'support+cus_ph86jo8sxxrypn@boostbot.ai',
    'support+cus_piiiunog4w8xwc@boostbot.ai',
    'support+cus_nk1c3vyfoxmnlk@boostbot.ai',
    'support+cus_o0peouuragdrfh@boostbot.ai',
    'support+cus_o2muqox7ji3wki@boostbot.ai',
    'support+cus_p2q9ssbirkaldp@boostbot.ai',
    'support+cus_ottmnkcvwfc5rm@boostbot.ai',
    'support+cus_pb4byis2fwqnpd@boostbot.ai',
    'support+cus_pcyab9pc8au7uw@boostbot.ai',
    'support+cus_o8ut49l6acddmu@boostbot.ai',
    'support+cus_odd4uxyofuodeo@boostbot.ai',
    'support+cus_odakcsyevgdym4@boostbot.ai',
    'support+cus_ose63dlf3o6uij@boostbot.ai',
    'support+cus_panrfbsc7mpunh@boostbot.ai',
    'support+cus_o9m2fnkiatwtyp@boostbot.ai',
    'support+cus_oruec4eyonxxn7@boostbot.ai',
    'support+cus_osaiti5qwcm9qa@boostbot.ai',
    'support+cus_panjlwf6nk1vc2@boostbot.ai',
    'support+cus_pamtllwyln4y12@boostbot.ai',
    'support+cus_pb7zspz00vzowy@boostbot.ai',
    'support+cus_o7pfs4zjzqdz28@boostbot.ai',
    'support+cus_o9lofdsm2be7qf@boostbot.ai',
    'support+cus_ohjlofgibuxyi0@boostbot.ai',
    'support+cus_oiqw7o6cgkinpi@boostbot.ai',
    'support+cus_orb0duf9bmg4pc@boostbot.ai',
    'support+cus_otvwio1pad4nvc@boostbot.ai',
    'support+cus_otj6pygl2rdvz0@boostbot.ai',
    'support+cus_o2j5qlfpx99naf@boostbot.ai',
    'support+cus_o9rddadiccokwh@boostbot.ai',
    'support+cus_odvqsnfk1dbomk@boostbot.ai',
    'support+cus_ose1jz92plt5w2@boostbot.ai',
    'support+cus_ovn646zeyjhuzs@boostbot.ai',
    'support+cus_owardbexrxog6u@boostbot.ai',
    'support+cus_ouk8jlcrwza4wb@boostbot.ai',
    'support+cus_ov77fsdbsvmnts@boostbot.ai',
    'support+cus_oxrza4fwn2zlhn@boostbot.ai',
    'support+cus_oxoft1jnqevdeb@boostbot.ai',
    'support+cus_oyitrruj3yj2sr@boostbot.ai',
    'support+cus_p1wec1txquy3yz@boostbot.ai',
    'support+cus_oxbkd9ywcyklzl@boostbot.ai',
    'support+cus_p0dyftvgttlkdv@boostbot.ai',
    'support+cus_p0j5tsjgif5cqf@boostbot.ai',
    'support+cus_owb8bsts5t7nfw@boostbot.ai',
    'support+cus_owsb8558hw5v89@boostbot.ai',
    'support+cus_oykltkk4xpvtc6@boostbot.ai',
    'support+cus_oyf0d2derlmmr1@boostbot.ai',
    'support+cus_ova2bvbiwawgjq@boostbot.ai',
    'support+cus_otxvt26lpnhgaq@boostbot.ai',
    'support+cus_oxrmjgrkkjoz0u@boostbot.ai',
    'support+cus_ooiq7blqoslx8p@boostbot.ai',
    'support+cus_oyd1vq7zhfdyjf@boostbot.ai',
    'support+cus_p1ulbk9xsvg7fc@boostbot.ai',
    'support+cus_ovnchovq7agjtc@boostbot.ai',
    'support+cus_ovnqqtroawskk0@boostbot.ai',
    'support+cus_p14qlhix5tqu20@boostbot.ai',
    'support+cus_p1hlgzkh5nggk8@boostbot.ai',
    'support+cus_p1jtbv9lxkldt3@boostbot.ai',
    'support+cus_oyigudxiclwewv@boostbot.ai',
    'support+cus_oudpwjqulnm9mf@boostbot.ai',
    'support+cus_ovkfhl3mq5jdkq@boostbot.ai',
    'support+cus_p2rze7feczughm@boostbot.ai',
    'support+cus_pbathqmj8pgpqm@boostbot.ai',
    'support+cus_pbnypnrdmdb2rp@boostbot.ai',
    'support+cus_pbvgrv5qlnskuj@boostbot.ai',
    'support+cus_ovcny186dnivv0@boostbot.ai',
    'support+cus_p2pxk6iumly1ug@boostbot.ai',
    'support+cus_ov7a2crxictd0j@boostbot.ai',
    'support+cus_oxeifsrthkw0ej@boostbot.ai',
    'support+cus_oxgqsghlao1ttz@boostbot.ai',
    'support+cus_ovhynp45jatpto@boostbot.ai',
    'support+cus_pczr42rtncxtxy@boostbot.ai',
    'support+cus_pdczu7hky0n6jl@boostbot.ai',
    'support+cus_piasizied1hy4x@boostbot.ai',
    'support+cus_pdqu7figliygwl@boostbot.ai',
    'support+cus_pdqxzqkkbvtfaa@boostbot.ai',
    'support+cus_pdla3gjtmvmyr1@boostbot.ai',
    'support+cus_pj1b5tpoz3kics@boostbot.ai',
    'support+cus_pap2eul3j6sz3r@boostbot.ai',
    'support+cus_pbv5cxck20ottm@boostbot.ai',
    'support+cus_pfavzyuupv8m4b@boostbot.ai',
    'support+cus_pg3askmlwvgoje@boostbot.ai',
    'support+cus_pgkaonhypipafv@boostbot.ai',
    'support+cus_phxt6x5c580sur@boostbot.ai',
    'support+cus_pj5adcuwkmlyky@boostbot.ai',
    'support+cus_ov3djmya4e4zvt@boostbot.ai',
    'support+cus_paudunh6td2qbq@boostbot.ai',
    'support+cus_pb8nfayyxipi3n@boostbot.ai',
    'support+cus_pjtvmiiejqk7s0@boostbot.ai',
    'support+cus_pjbrhfcfnnvzz0@boostbot.ai',
    'support+cus_pjhlrnh4mwakzw@boostbot.ai',
    'support+cus_pjlq1v223ul6lu@boostbot.ai',
    'support+cus_oxni7wdhotxxvy@boostbot.ai',
    'support+cus_pfxpoevyzyrexz@boostbot.ai',
    'support+cus_pg8g1evgdmjdnd@boostbot.ai',
    'support+cus_pgg5y8flbs4axr@boostbot.ai',
    'support+cus_pgpxiduk4j5lda@boostbot.ai',
    'support+cus_piypfxdttlgmet@boostbot.ai',
    'support+cus_pgo4mapv443cwg@boostbot.ai',
    'support+cus_oclatstotmzuk5@boostbot.ai',
    'support+cus_ohtojnfewgozxv@boostbot.ai',
    'support+cus_ogqog2pdftnlwa@boostbot.ai',
    'support+cus_ohrlpvcjfeowgc@boostbot.ai',
    'support+cus_ogixgprose52q4@boostbot.ai',
    'support+cus_ohsoknhx6d4q0h@boostbot.ai',
    'support+cus_on9qehkupv8cln@boostbot.ai',
    'support+cus_owb8l9euz2f1da@boostbot.ai',
    'support+cus_omkpjnsolneulq@boostbot.ai',
    'support+cus_omoqjqfu09fm9t@boostbot.ai',
    'support+cus_omnwnku67wnamo@boostbot.ai',
    'support+cus_omqjjzyan9plx5@boostbot.ai',
    'support+cus_omnajdlzoqzj42@boostbot.ai',
    'support+cus_ov4gp6xqsayl8h@boostbot.ai',
    'support+cus_p0fhcatruwckdk@boostbot.ai',
    'support+cus_ovikymyllfjayh@boostbot.ai',
    'support+cus_oyj50b92sg2wgk@boostbot.ai',
    'support+cus_ovlhrka1hzrxub@boostbot.ai',
    'support+cus_p1vuwhxfvuusuc@boostbot.ai',
    'support+cus_opimraewjfi6dg@boostbot.ai',
    'support+cus_ozvyfg5orzbip5@boostbot.ai',
    'support+cus_oycuz2vzwp5vng@boostbot.ai',
    'support+cus_ovm7sl9rcvxoi9@boostbot.ai',
    'support+cus_p0gm83ees7edwq@boostbot.ai',
    'support+cus_osjlt9mv5fhwbe@boostbot.ai',
    'support+cus_ot5ul2yhptcwxe@boostbot.ai',
    'support+cus_oxq1mmpjuvzuei@boostbot.ai',
    'support+cus_oss5xacpzyyfom@boostbot.ai',
    'support+cus_oypvmn2zran2n3@boostbot.ai',
    'support+cus_p0fuesgwvfd806@boostbot.ai',
    'support+cus_p1tnr4jfeohie1@boostbot.ai',
    'support+cus_oxft7ym3wtnlad@boostbot.ai',
    'support+cus_oxua1zatk7gqrr@boostbot.ai',
    'support+cus_oxzpaykzkd8osi@boostbot.ai',
    'support+cus_og1dhrnwfidbzx@boostbot.ai',
];
const updateSuperUserPasswords: NextApiHandler = async (_req, res) => {
    console.log('updateSuperUserPasswords');

    type SubscriptionStatus = 'awaiting_payment_method' | 'trial' | 'active' | 'canceled' | 'paused';
    const activeStatus = ['trial', 'active', 'paused'] as SubscriptionStatus[];
    const activeCompanies = await db()
        .select({ id: companies.id })
        .from(companies)
        .where(inArray(companies.subscription_status, activeStatus));
    const activeCompanyIds = activeCompanies.map((c) => c.id);

    const affectedUsers = await db()
        .select()
        .from(profilesSchema)
        .where(
            and(
                ilike(profilesSchema.email, '%support+%'),
                notInArray(profilesSchema.email, [...alreadyProcessed, ...loginFailed]),
                inArray(profilesSchema.company_id, activeCompanyIds),
            ),
        );

    console.log('superUsers', affectedUsers?.length);

    const failed: string[] = [];
    const alreadyUpdated: string[] = [];
    const results: string[] = [];
    shouldStop = false;

    for (const user of affectedUsers) {
        if (shouldStop) {
            console.log('stopped');
            break;
        }
        if (!user.email) {
            console.log('no email', user);
            continue;
        }

        // logic above is a mess. lets try refactoring
        const oldPasswords = ['B00$t80t*Support', 'B00*Support', 'password123!'];
        const newPassword = process.env.SERVICE_ACCOUNT_PASSWORD ?? '';
        if (!newPassword) {
            throw new Error('new password not set');
        }
        const { data: shouldBePassword } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: newPassword,
        });
        if (shouldBePassword.user?.id) {
            console.log('password already updated');
            alreadyUpdated.push(user.email);
            continue;
        }
        let id = '';
        for (const password of oldPasswords) {
            const { error, data: signinResData } = await supabase.auth.signInWithPassword({
                email: user.email,
                password,
            });
            if (error) {
                // console.log('error signing in with old passwords', error, password);
                continue;
            }
            if (signinResData?.user?.id) {
                id = signinResData?.user?.id;
                break;
            }
        }
        if (!id) {
            console.log('unable to log in with old passwords', user.email);
            failed.push(user.email);
            continue;
        }
        await supabase.auth.updateUser({
            email: user.email,
            password: process.env.SERVICE_ACCOUNT_PASSWORD,
        });
        console.log('updated', user.email);
        results.push(user.email);
    }

    console.log('failed', JSON.stringify(failed));
    // console.log('updated', results);
    // console.log('alreadyUpdated', alreadyUpdated);
    const toIgnore = [...alreadyUpdated, ...results];
    console.log('to ignore next round', JSON.stringify(toIgnore));

    return res.send({ results });
};

const _updateSuperUserEmailEngineAccountIds: NextApiHandler = async (_req, res) => {
    console.log('updateSuperUserEmailEngineAccountIds');
    const affectedUserEmailengineAccountIds = [
        'hitb1w9whwi1zgxd',
        '3ozhp5k44b3o08x8',
        'hn3f34a5ucfqac3a',
        'iqth3khgpootqdav',
        '8e4qxf6qbux2fvw5',
        'bspu6ywz70nxq4js',
        'sc8pc9krygnpeq7q',
        'n1as8g25a8et32mm',
        '58jw7k9v81eyiwh8',
        'xtb2dtv0i5h22wlm',
        'oka59gixztqwbvjm',
        '83m6lgt150ov43r3',
        'f5hr7c61wlr5iu6e',
        'h9a1wzcztc3i3air',
        'znyrkk4q5g7gebsv',
        '37xxa5nlj8vhwb9h',
        '9i2yi0xa4chs95ld',
        'fvovl2wcvqd95cq9',
        'iwi0s7dep71wdqlh',
    ];
    const affectedUsers = await db()
        .select()
        .from(profilesSchema)
        .where(inArray(profilesSchema.email_engine_account_id, affectedUserEmailengineAccountIds));

    console.log('affectedUsers', affectedUsers?.length);

    const affectedCompanies = await db()
        .select()
        .from(companies)
        .where(inArray(companies.id, affectedUsers.map((u) => u.company_id) as string[]));

    console.log('affectedCompanies', affectedCompanies?.length);

    const results: string[] = [];
    shouldStop = false;

    for (const user of affectedUsers) {
        if (shouldStop) {
            console.log('stopped');
            break;
        }
        if (!user.email) {
            console.log('no email', user);
            continue;
        }
        if (user.email?.includes('support+')) {
            console.log('support user already has email engine account ID, skipping');
            continue;
        }
        const company = affectedCompanies.find((c) => c.id === user.company_id);
        if (!company) {
            console.log('no company', user);
            continue;
        }
        // login as support user to change password
        const identifier = company.cus_id?.toLowerCase().trim();
        const supportEmail = `support+${identifier}@boostbot.ai`;
        let supportAccountId = '';

        const newPassword = process.env.SERVICE_ACCOUNT_PASSWORD ?? '';
        if (!newPassword) {
            throw new Error('new password not set');
        }
        const { data: supportAccount } = await supabase.auth.signInWithPassword({
            email: supportEmail,
            password: newPassword,
        });
        supportAccountId = supportAccount?.user?.id ?? '';

        if (!supportAccountId) {
            console.log('unable to log in with support account', supportEmail, newPassword);
            continue;
        }
        console.log('supportAccountId', supportAccountId, user.email_engine_account_id, user.sequence_send_email);

        await db()
            .update(profilesSchema)
            .set({
                email_engine_account_id: user.email_engine_account_id,
                sequence_send_email: user.sequence_send_email,
            })
            .where(eq(profilesSchema.id, supportAccountId));

        results.push(supportAccountId);
    }

    console.log('updated', results);

    return res.send({ results });
};

const _updateSupportUsersPasswords: NextApiHandler = async (_req, res) => {
    console.log('updateSupportUsersPasswords');
    shouldStop = false;
    const supportUsers = await db().select().from(profilesSchema).where(ilike(profilesSchema.email, '%support+%'));
    console.log('supportUsers', supportUsers?.length);

    for (const user of supportUsers) {
        if (shouldStop) {
            console.log('stopped');
            break;
        }
        const email = user.email ?? '';
        if (!email) {
            console.log('no email', user);
            continue;
        }
        const password = 'B00*Support';
        let id = ''; // see if still empty after login
        const { error: error2, data: signinResData } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error2) {
            const { error: error3, data: otherPass } = await supabase.auth.signInWithPassword({
                email,
                password: 'B00$t80t*Support',
            });
            if (error3) {
                continue;
            } else {
                id = otherPass?.user?.id ?? '';
            }
        } else {
            id = signinResData?.user?.id ?? '';
        }

        if (!id) {
            console.log('Error signing in with old passwords');
            continue;
        }
        const { error, data: updated } = await supabase.auth.updateUser({
            password: process.env.SERVICE_ACCOUNT_PASSWORD,
        });
        if (error) {
            console.log('error updating password');
            console.error(error);
            continue;
        }
        console.log('updated', updated, process.env.SERVICE_ACCOUNT_PASSWORD);
    }
    return res.json({ ok: 'asd' });
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

const handleStop: NextApiHandler = async (_req, res) => {
    shouldStop = true;
    return res.status(200).json({ message: 'stopping' });
};

const _deleteSuspendedAccountJobs: NextApiHandler = async (_req, res) => {
    const failedOrPendingJobs = (await db()
        .select({ payload: jobs.payload, id: jobs.id })
        .from(jobs)
        .where(
            and(eq(jobs.queue, 'sequence_step_send'), or(eq(jobs.status, 'failed'), eq(jobs.status, 'pending'))),
        )) as { id: string; payload: { emailEngineAccountId: string } }[];

    const payloads = failedOrPendingJobs.map((j) => j.payload);
    // console.log(payloads);
    const payloadAccounts = payloads.map((p) => p.emailEngineAccountId);
    const activeAccounts = [
        // got from Email engine API
        '0xu37s825q3on348',
        '1tj6nzr1sf89672v',
        '1tpuxkha9rgdvio3',
        '37xxa5nlj8vhwb9h',
        '3ozhp5k44b3o08x8',
        '3tsfh97079jmgnni',
        '58jw7k9v81eyiwh8',
        '83m6lgt150ov43r3',
        '8e4qxf6qbux2fvw5',
        '9i2yi0xa4chs95ld',
        'bspu6ywz70nxq4js',
        'echa',
        'f5hr7c61wlr5iu6e',
        'fc6kby0dep7zxgo0',
        'fvovl2wcvqd95cq9',
        'gtfebdqrn758321l',
        'h9a1wzcztc3i3air',
        'hitb1w9whwi1zgxd',
        'hn3f34a5ucfqac3a',
        'hqkcg7fe1086zc9a',
        'iqth3khgpootqdav',
        'iwi0s7dep71wdqlh',
        'j273xv087yujnum2',
        'n1as8g25a8et32mm',
        'o027vgrbc3pze0he',
        'oka59gixztqwbvjm',
        'pdy2s7tesmxcpyn9',
        'q0n4dfn1fvs9ak0j',
        'sc8pc9krygnpeq7q',
        'v1v4t0yhlra1g1mi',
        'vn6onkibk5qj8kwb',
        'xtb2dtv0i5h22wlm',
        'znyrkk4q5g7gebsv',
    ];

    const suspendedAccounts = new Set(payloadAccounts.filter((p) => !activeAccounts.includes(p)));
    // console.log('suspendedAccounts', suspendedAccounts);

    const toDelete = failedOrPendingJobs
        .filter((j) => suspendedAccounts.has(j.payload.emailEngineAccountId))
        .map((j) => j.id);

    const deleted = await db().delete(jobs).where(inArray(jobs.id, toDelete)).returning({ id: jobs.id });
    console.log('deleted', deleted);
    return res.json({ deleted });
};

const examplePayload = {
    emailEngineAccountId: 'u14h6qshz6u2mu6p\n',
    sequenceInfluencer: {
        id: '4d89bbf6-692d-4608-bf32-35bed7ced8ce',
        created_at: '2023-10-30T02:19:00.673183+00:00',
        updated_at: '2023-11-16T03:58:18.527+00:00',
        added_by: 'b5f8e241-ee9b-4ece-bebd-888fc4fe94fa',
        email: 'onlyerrice@gmail.com',
        sequence_step: 0,
        funnel_status: 'To Contact',
        tags: ['pregnancy', 'fertilityjourney', 'pcos'],
        next_step: null,
        scheduled_post_date: null,
        video_details: null,
        rate_amount: 0,
        rate_currency: 'USD',
        real_full_name: null,
        company_id: '00da5f09-4ce1-404e-a2ce-18f137b739e2',
        sequence_id: '8906cd31-4613-4fc7-976a-00180c1101bc',
        address_id: null,
        influencer_social_profile_id: '1d1acfae-fc0a-4a6a-810d-de0961b90e66',
        iqdata_id: '6936869082667779077',
        avatar_url:
            'https://imgp.sptds.icu/v2?9gRRkBbg4nctjMDXek72QaA0lwJ%2B7AvoxtJKlEuzU8RZC78ehYBtaTYOSfFVCKJiVkpQ0sG16SNCfTbjlQU%2BgUNqE22XuFHqLd080bd2kP%2B9dT25K9CASe%2BaHw5hnNgCS%2FGfIvCb4BWfDz3VLG%2Fwfg%3D%3D',
        name: 'Onlyerrice',
        platform: 'tiktok',
        social_profile_last_fetched: '2023-10-30T02:20:05.286+00:00',
        url: 'https://www.tiktok.com/@6936869082667779077',
        username: 'onlyaerrice',
        address: null,
        manager_first_name: 'Mingzhen',
        recent_post_title: 'TTC products . #geritolbaby #ttcjourney #ttccommunity...',
        recent_post_url: 'https://www.tiktok.com/@onlyaerrice/video/7295448905200700715',
    },
};

type Payload = typeof examplePayload;

const _rescheduleLostOutboxJobs: NextApiHandler = async (_req, res) => {
    console.log('rescheduleLostOutboxJobs');
    const activeAccounts = [
        // got from Email engine API
        '0xu37s825q3on348',
        '1tj6nzr1sf89672v',
        '1tpuxkha9rgdvio3',
        '37xxa5nlj8vhwb9h',
        '3ozhp5k44b3o08x8',
        '3tsfh97079jmgnni',
        '58jw7k9v81eyiwh8',
        '83m6lgt150ov43r3',
        '8e4qxf6qbux2fvw5',
        '9i2yi0xa4chs95ld',
        'bspu6ywz70nxq4js',
        'echa',
        'f5hr7c61wlr5iu6e',
        'fc6kby0dep7zxgo0',
        'fvovl2wcvqd95cq9',
        'gtfebdqrn758321l',
        'h9a1wzcztc3i3air',
        'hitb1w9whwi1zgxd',
        'hn3f34a5ucfqac3a',
        'hqkcg7fe1086zc9a',
        'iqth3khgpootqdav',
        'iwi0s7dep71wdqlh',
        'j273xv087yujnum2',
        'n1as8g25a8et32mm',
        'o027vgrbc3pze0he',
        'oka59gixztqwbvjm',
        'pdy2s7tesmxcpyn9',
        'q0n4dfn1fvs9ak0j',
        'sc8pc9krygnpeq7q',
        'v1v4t0yhlra1g1mi',
        'vn6onkibk5qj8kwb',
        'xtb2dtv0i5h22wlm',
        'znyrkk4q5g7gebsv',
    ];
    type Job = {
        id: string;
        payload: Payload;
    };

    const emailsStuckInScheduled = await db()
        .select()
        .from(sequence_emails)
        .where(
            and(
                eq(sequence_emails.email_delivery_status, 'Scheduled'),
                inArray(sequence_emails.email_engine_account_id, activeAccounts),
            ),
        );

    const stuckJobIds = emailsStuckInScheduled.filter((e) => e.job_id).map((e) => e.job_id) as string[];
    const allSucceededJobs = (await db()
        .select({ id: jobs.id, payload: jobs.payload })
        .from(jobs)
        .where(and(eq(jobs.status, 'success'), eq(jobs.queue, 'sequence_step_send'), inArray(jobs.id, stuckJobIds)))
        .orderBy(asc(jobs.created_at))) as Job[];

    // console.log('allSucceededJobs', allSucceededJobs.length);
    const succeededJobs = allSucceededJobs.filter((j) => activeAccounts.includes(j.payload.emailEngineAccountId));
    // console.log('succeededJobs', succeededJobs.length);
    const affectedInfluencers: string[] = [];

    console.log('emailsStuckInScheduled', emailsStuckInScheduled.length);

    const allOutbox = await getOutbox();
    const outbox = allOutbox.filter((e) => activeAccounts.includes(e.account));
    console.log('outbox', outbox.length);
    const affectedUsers: string[] = [];
    const result = [];
    shouldStop = false;
    // if the email is stuck in scheduled, and not in the outbox. mark the old 'succeeded' job as pending.
    for (const email of emailsStuckInScheduled) {
        if (shouldStop) {
            console.log('stopped');
            break;
        }
        const found = outbox.find((e) => e.messageId === email.email_message_id);
        // console.log('found', found, email.email_message_id);
        if (!found) {
            const job = succeededJobs.find((j) => j.payload.sequenceInfluencer.id === email.sequence_influencer_id);
            // console.log('job', job);
            if (job) {
                // option one:
                // await db().update(jobs).set({ status: 'pending' }).where(eq(jobs.id, job.id));
                // Remove the need for the current PR by:
                // also delete the 'scheduled' emails so that when we reinsert there is no problem.
                result.push(job.id);
                if (!affectedUsers.includes(job.payload.emailEngineAccountId)) {
                    affectedUsers.push(job.payload.emailEngineAccountId);
                }
                if (!affectedInfluencers.includes(email.sequence_influencer_id)) {
                    affectedInfluencers.push(email.sequence_influencer_id);
                }
                // option two:

                // delete all the jobs and emails, and set the sequence influencer to 'To Contact'
                // await db().delete(sequence_emails).where(eq(sequence_emails.email_message_id, email.email_message_id));

                // await db().update(sequence_influencers).set({ funnel_status: 'To Contact' }).where(
                //     eq(sequence_influencers.id, email.sequence_influencer_id),
                // );
                // contact users and ask if they want to re-send.
            }
        }
    }
    // console.log('result', result.length);
    // console.log('affectedUsers', affectedUsers);
    console.log('affectedInfluencers', affectedInfluencers);
    return res.send({ result });
};

export default ApiHandlerWithContext({
    getHandler: updateSuperUserPasswords,
    deleteHandler: handleStop,
});
