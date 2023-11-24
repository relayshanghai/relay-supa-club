import { SequenceSend, type SequenceSendPayload } from 'src/utils/analytics/events/outreach/sequence-send';
import type { SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import {
    deleteSequenceEmailsByInfluencerCall,
    getSequenceEmailByInfluencerAndSequenceStep,
    getSequenceEmailsByEmailEngineAccountId,
    getSequenceEmailsBySequenceInfluencerCall,
    insertSequenceEmailCall,
} from 'src/utils/api/db/calls/sequence-emails';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';

import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { calculateSendAt } from 'src/utils/api/email-engine/schedule-emails';
import { sendTemplateEmail } from 'src/utils/api/email-engine/send-template-email';
import { gatherMessageIds, generateReferences } from 'src/utils/api/email-engine/thread-helpers';
import { crumb, serverLogger } from 'src/utils/logger-server';
import { rudderstack, track } from 'src/utils/rudderstack/rudderstack';
import { db } from 'src/utils/supabase-client';
import type { OutboxGetMessage } from 'types/email-engine/outbox-get';
import type { JobInterface } from '../types';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import type { SendResult } from 'pages/api/sequence/send';
import { maxExecutionTime } from 'src/utils/max-execution-time';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
import { getTemplateVariablesBySequenceIdCall } from 'src/utils/api/db/calls/template-variables';

type SequenceSendEventPayload = {
    emailEngineAccountId: string;
    sequenceInfluencer: SequenceInfluencerManagerPage;
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
};

type SequenceSendEventRun = (payload: SequenceSendEventPayload) => Promise<any>;

const sendAndInsertEmail = async ({
    step,
    account,
    influencer,
    templateVariables,
    messageId,
    references,
    scheduledEmails,
}: {
    step: SequenceStep;
    influencer: SequenceInfluencerManagerPage;
    account: string;
    templateVariables: TemplateVariable[];
    messageId: string;
    references: string;
    scheduledEmails: Pick<SequenceEmail, 'email_send_at'>[];
}): Promise<SendResult> => {
    if (!influencer.email) {
        throw new Error('No email address');
    }
    const influencerAccountName = influencer.name || influencer.username;
    if (!influencerAccountName) {
        throw new Error('No influencer name or handle');
    }
    const recentPostTitle = influencer.recent_post_title ?? 'recent';
    const recentPostURL = influencer.recent_post_url;
    if (!recentPostURL) {
        throw new Error('No recent post url');
    }
    // make sure there is not an existing sequence email for this influencer for this step:
    const { data: existingSequenceEmail } = await db(getSequenceEmailByInfluencerAndSequenceStep)(
        influencer.id,
        step.id,
    );
    if (existingSequenceEmail && existingSequenceEmail.email_delivery_status) {
        // This should not happen, but due to a previous bug, some sequence influencers were not updated to 'In Sequence' when the email was sent.
        if (influencer.funnel_status === 'To Contact') {
            await db(updateSequenceInfluencerCall)({
                id: influencer.id,
                funnel_status: 'In Sequence',
            });
            return { sequenceInfluencerId: influencer.id, stepNumber: step.step_number };
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
    const emailSendAt = (await calculateSendAt(wait_time_hours, scheduledEmails)).toISOString();

    const res = await sendTemplateEmail({
        account,
        toEmail: influencer.email,
        template: template_id,
        sendAt: emailSendAt,
        params,
        messageId,
        references,
    });

    if ('error' in res) {
        throw new Error(res.error);
    }
    await db(insertSequenceEmailCall)({
        sequence_influencer_id: influencer.id,
        sequence_id: influencer.sequence_id,
        sequence_step_id: step.id,
        email_delivery_status: 'Scheduled',
        email_message_id: res.messageId,
        email_send_at: emailSendAt,
        email_engine_account_id: account,
    });

    return { sequenceInfluencerId: influencer.id, stepNumber: step.step_number };
};

const sendSequence = async ({
    emailEngineAccountId: account,
    sequenceInfluencer: influencer,
    sequenceSteps,
    templateVariables,
}: SequenceSendEventPayload) => {
    const results: SendResult[] = [];
    const startTime = Date.now();

    const trackData: SequenceSendPayload = {
        extra_info: { results },
        account,
        sequence_influencer_id: influencer.id,
        is_success: false,
    };
    crumb({ message: 'Start Sequence Send Job' });

    try {
        await identifyAccount(account);

        if (!account) {
            throw new Error('Missing required account id');
        }
        if (!sequenceSteps || sequenceSteps.length === 0) {
            sequenceSteps = (await db(getSequenceStepsBySequenceIdCall)(influencer.sequence_id)) ?? [];
        }
        sequenceSteps?.sort((a, b) => a.step_number - b.step_number);
        if (!sequenceSteps || sequenceSteps.length === 0) {
            throw new Error('No sequence steps found');
        }

        if (!templateVariables || templateVariables.length === 0) {
            templateVariables = await db(getTemplateVariablesBySequenceIdCall)(influencer.sequence_id);
        }

        if (!templateVariables || templateVariables.length === 0) {
            throw new Error('No template variables found');
        }
        trackData.extra_info.sequence_steps = sequenceSteps?.map((step) => step.id);

        trackData.extra_info.template_variables = templateVariables.map((variable) => variable.id);
        crumb({ message: 'Get scheduled emails' });
        const scheduledEmails = await db(getSequenceEmailsByEmailEngineAccountId)(account);
        const messageIds = gatherMessageIds(influencer.email ?? '', sequenceSteps);
        if (!influencer.influencer_social_profile_id) {
            throw new Error('No influencer social profile id');
        }
        for (const step of sequenceSteps) {
            crumb({ message: `Create step ${step.step_number}` });
            try {
                const references = generateReferences(messageIds, step.step_number);
                const result = await sendAndInsertEmail({
                    step,
                    account,
                    influencer,
                    templateVariables,
                    references,
                    messageId: messageIds[step.step_number],
                    scheduledEmails,
                });
                results.push(result);
            } catch (error: any) {
                serverLogger(error);
                results.push({
                    sequenceInfluencerId: influencer.id,
                    error:
                        `error: ${error?.message}\n stack ${error?.stack}` ?? 'Something went wrong sending the email',
                    stepNumber: step.step_number,
                });
            }
        }
    } catch (error) {
        serverLogger(error); // truly unexpected error
        track(rudderstack.getClient(), rudderstack.getIdentity())(SequenceSend, trackData);
        return { results, success: false };
    }

    trackData.extra_info.results = results;
    crumb({ message: `Handle results` });
    const success = await handleResults(results, influencer);
    trackData.is_success = success;
    trackData.extra_info.duration = Date.now() - startTime;
    track(rudderstack.getClient(), rudderstack.getIdentity())(SequenceSend, trackData);
    return { results, success };
};

const handleResults = async (results: SendResult[], influencer: SequenceInfluencerManagerPage) => {
    try {
        if (!results || results.length === 0 || results.some((result) => result.error)) {
            const outbox = await getOutbox();
            await handleSendFailed(influencer, outbox);
            return false;
        } else {
            return true;
        }
    } catch (error) {
        serverLogger(error);
        return false;
    }
};

/** Revert the optimistic update and set the influencer to 'To Contact', delete the sequence_emails, and cancel outgoing emails in the outbox */
const handleSendFailed = async (sequenceInfluencer: SequenceInfluencerManagerPage, outbox: OutboxGetMessage[]) => {
    try {
        await db<typeof updateSequenceInfluencerCall>(updateSequenceInfluencerCall)({
            id: sequenceInfluencer.id,
            funnel_status: 'To Contact',
        });
        const emails = await db(getSequenceEmailsBySequenceInfluencerCall)(sequenceInfluencer.id);
        for (const email of emails) {
            const outboxMessage = outbox.find((m) => m.messageId === email.email_message_id);
            if (outboxMessage && email.email_message_id) {
                await deleteEmailFromOutbox(email.email_message_id);
            }
        }
        await db(deleteSequenceEmailsByInfluencerCall)(sequenceInfluencer.id);
    } catch (error) {
        serverLogger(error);
    }
};

export const SequenceSendEvent: JobInterface<'sequence_send', SequenceSendEventRun> = {
    name: 'sequence_send',
    run: async (payload) => {
        const maxRunTime = 1000 * 7; // 7 seconds

        const { results, success } = await maxExecutionTime(sendSequence(payload), maxRunTime);

        if (!success) {
            throw new Error('Sequence send job failed. results: ' + JSON.stringify(results));
        }

        return results;
    },
};
