import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { SequenceEmail, SequenceInfluencerInsert, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import { type SequenceInfluencer } from 'src/utils/api/db';
import { getInfluencerSocialProfileByIdCall } from 'src/utils/api/db/calls/influencers';
import { getSequenceEmailsBySequenceCall, insertSequenceEmailCall } from 'src/utils/api/db/calls/sequence-emails';
import {
    updateSequenceInfluencerCall,
    updateSequenceInfluencersCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
import { getTemplateVariablesBySequenceIdCall } from 'src/utils/api/db/calls/template-variables';
import { calculateSendAt } from 'src/utils/api/email-engine/schedule-emails';
import { sendTemplateEmail } from 'src/utils/api/email-engine/send-template-email';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';

export type SequenceSendPostBody = {
    account: string;
    sequenceInfluencers: SequenceInfluencer[];
};

export type SendResult = { stepNumber?: number; sequenceInfluencerId?: string; error?: string };

export type SequenceSendPostResponse = SendResult[];

const sendAndInsertEmail = async ({
    step,
    account,
    sequenceInfluencer,
    templateVariables,
    sequenceEmails,
    sequenceSteps,
}: {
    step: SequenceStep;
    sequenceInfluencer: SequenceInfluencer;
    account: string;
    templateVariables: TemplateVariable[];
    sequenceEmails: SequenceEmail[];
    sequenceSteps: SequenceStep[];
}): Promise<SendResult> => {
    if (!sequenceInfluencer.email) {
        throw new Error('No email address');
    } else if (!sequenceInfluencer.influencer_social_profile_id) {
        throw new Error('No influencer social profile id');
    }
    const influencerSocialProfile = await db(getInfluencerSocialProfileByIdCall)(
        sequenceInfluencer.influencer_social_profile_id,
    );
    const influencerAccountName = influencerSocialProfile.name || influencerSocialProfile.username;
    if (!influencerAccountName) {
        throw new Error('No influencer name or handle');
    }
    const recentPostTitle = influencerSocialProfile.recent_post_title;
    if (!recentPostTitle) {
        throw new Error('No recent video title');
    }
    const recentPostURL = influencerSocialProfile.recent_post_url;
    if (!recentPostURL) {
        throw new Error('No recent post url');
    }
    // make sure there is not an existing sequence email for this influencer for this step:
    const existingSequenceEmail = sequenceEmails.find(
        (sequenceEmail) =>
            sequenceEmail.sequence_influencer_id === sequenceInfluencer.id &&
            sequenceEmail.sequence_step_id === step.id,
    );

    if (existingSequenceEmail && existingSequenceEmail.email_delivery_status) {
        // This should not happen, but due to a previous bug, some sequence influencers were not updated to 'In Sequence' when the email was sent.
        if (sequenceInfluencer.funnel_status === 'To Contact') {
            await db(updateSequenceInfluencerCall)({
                id: sequenceInfluencer.id,
                funnel_status: 'In Sequence',
            });
            return { sequenceInfluencerId: sequenceInfluencer.id, stepNumber: step.step_number };
        } else {
            throw new Error('Email already sent');
        }
    }

    const params = {
        ...Object.fromEntries(templateVariables.map((variable) => [variable.key, variable.value])),
        // fill in the params not in the template variables
        influencerAccountName,
        recentPostTitle,
        recentPostURL,
    };
    // add the step's waitTimeHrs to the sendAt date
    const { template_id, wait_time_hours } = step;
    const emailSendAt = (await calculateSendAt(account, wait_time_hours)).toISOString();

    const previousStep = sequenceSteps.find((sequenceStep) => sequenceStep.step_number === step.step_number - 1);
    const previousSequenceEmail = sequenceEmails.find(
        (sequenceEmail) =>
            sequenceEmail.sequence_influencer_id === sequenceInfluencer.id &&
            sequenceEmail.sequence_step_id === previousStep?.id,
    );

    const res = await sendTemplateEmail(
        account,
        sequenceInfluencer.email,
        template_id,
        emailSendAt,
        params,
        previousSequenceEmail?.email_message_id,
    );

    if ('error' in res) {
        throw new Error(res.error);
    }
    await db(insertSequenceEmailCall)({
        sequence_influencer_id: sequenceInfluencer.id,
        sequence_id: sequenceInfluencer.sequence_id,
        sequence_step_id: step.id,
        email_delivery_status: 'Scheduled',
        email_message_id: res.messageId,
        email_send_at: emailSendAt,
    });

    return { sequenceInfluencerId: sequenceInfluencer.id, stepNumber: step.step_number };
};

// eslint-disable-next-line complexity
const sendSequence = async ({ account, sequenceInfluencers }: SequenceSendPostBody) => {
    const results: SendResult[] = [];
    if (!account || !sequenceInfluencers || sequenceInfluencers.length === 0) {
        throw new Error('Missing required parameters');
    }

    const sequenceId = sequenceInfluencers[0].sequence_id;
    const sequenceSteps = await db(getSequenceStepsBySequenceIdCall)(sequenceId);
    if (!sequenceSteps || sequenceSteps.length === 0) {
        throw new Error('No sequence steps found');
    }
    const templateVariables = await db(getTemplateVariablesBySequenceIdCall)(sequenceId);
    const sequenceEmails = await db(getSequenceEmailsBySequenceCall)(sequenceId);

    // optimistically update all the influencers to 'In Sequence'. Bulk updates do not allow updates to the email column
    const optimisticUpdates: SequenceInfluencerInsert[] = sequenceInfluencers.map(
        ({ id, name, username, avatar_url, url, added_by, platform, company_id, iqdata_id, sequence_id }) => ({
            id,
            funnel_status: 'In Sequence',
            // some typescript required values for the bulk update that have a mismatch with SequenceInfluencer row type.
            name: name ?? '',
            username: username ?? '',
            avatar_url: avatar_url ?? '',
            url: url ?? '',
            platform,
            added_by,
            company_id,
            iqdata_id,
            sequence_id,
        }),
    );
    await db(updateSequenceInfluencersCall)(optimisticUpdates);

    for (const sequenceInfluencer of sequenceInfluencers) {
        try {
            for (const step of sequenceSteps) {
                try {
                    const result = await sendAndInsertEmail({
                        step,
                        account,
                        sequenceInfluencer,
                        templateVariables,
                        sequenceEmails,
                        sequenceSteps,
                    });
                    results.push(result);
                } catch (error: any) {
                    serverLogger(error);
                    results.push({
                        sequenceInfluencerId: sequenceInfluencer.id,
                        error: error?.message ?? 'Something went wrong sending the email',
                    });
                }
            }
            // revert the optimistic update if not sent successfully
            const outreachResult = results.find((result) => result.stepNumber === 0);
            if (!outreachResult || outreachResult.error) {
                await db<typeof updateSequenceInfluencerCall>(updateSequenceInfluencerCall)({
                    id: sequenceInfluencer.id,
                    funnel_status: 'To Contact',
                });
            }
        } catch (error: any) {
            serverLogger(error);
            results.push({
                sequenceInfluencerId: sequenceInfluencer.id,
                error: error?.message ?? '',
            });
        }
    }

    return results;
};

const postHandler: NextApiHandler = async (req, res) => {
    const body = req.body as SequenceSendPostBody;
    const results: SequenceSendPostResponse = await sendSequence(body);
    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({ postHandler });
