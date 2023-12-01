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
import { calculateSendAt } from 'src/utils/api/email-engine/schedule-emails';

export type SequenceStepSendArgs = {
    emailEngineAccountId: string;
    sequenceInfluencer: SequenceInfluencerManagerPage;
    sequenceStep: SequenceStep;
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
};

type SequenceSendEventRun = (payload: SequenceStepSendArgs) => Promise<SendResult>;

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
        }
        return { sequenceInfluencerId: influencer.id, stepNumber: step.step_number };
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
    const emailSendAt = calculateSendAt(wait_time_hours, scheduledEmails).toISOString();

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

const sendSequenceStep = async ({
    emailEngineAccountId: account,
    sequenceInfluencer: influencer,
    sequenceStep: step,
    sequenceSteps,
    templateVariables,
}: SequenceStepSendArgs) => {
    const trackData: SequenceSendPayload = {
        sequence_influencer_id: influencer.id,
        account,
        is_success: false,
        extra_info: {
            sequence_step: step.id,
            template_variables: templateVariables.map((variable) => variable.id),
        },
    };
    const result: SendResult = {
        sequenceInfluencerId: influencer.id,
        stepNumber: step.step_number,
    };
    const startTime = Date.now();
    try {
        await identifyAccount(account);

        if (!account) {
            throw new Error('Missing required account id');
        }
        if (!step) {
            throw new Error('No sequence step found');
        }
        if (!templateVariables || templateVariables.length === 0) {
            throw new Error('No template variables found');
        }
        if (!influencer.influencer_social_profile_id) {
            throw new Error('No influencer social profile id');
        }

        const messageIds = gatherMessageIds(influencer.email, sequenceSteps);
        const references = generateReferences(messageIds, step.step_number);

        crumb({ message: 'Get scheduled emails' });
        const scheduledEmails = await db(getSequenceEmailsByEmailEngineAccountId)(account);

        crumb({ message: `Create step ${step.step_number}` });
        try {
            await sendAndInsertEmail({
                step,
                account,
                influencer,
                templateVariables,
                references,
                messageId: messageIds[step.step_number],
                scheduledEmails,
            });
        } catch (error: any) {
            serverLogger(error);
            result.error =
                `error: ${error?.message}\n stack ${error?.stack}` ?? 'Something went wrong sending the email';
        }
    } catch (error) {
        serverLogger(error); // truly unexpected error
        track(rudderstack.getClient(), rudderstack.getIdentity())(SequenceSend, trackData);
        return { result, success: false };
    }

    trackData.extra_info.results = result;
    const success = await handleResult(result, influencer);
    trackData.is_success = success;
    trackData.extra_info.duration = Date.now() - startTime;
    track(rudderstack.getClient(), rudderstack.getIdentity())(SequenceSend, trackData);
    return { result, success };
};

const handleResult = async (result: SendResult, influencer: SequenceInfluencerManagerPage) => {
    try {
        if (!result || result.error) {
            crumb({ message: `Handle Result: failed` });
            const outbox = await getOutbox();
            await handleSendFailed(influencer, outbox);
            return false;
        } else {
            crumb({ message: `Handle Result: success` });
            return true;
        }
    } catch (error) {
        serverLogger(error);
        return false;
    }
};

/** Revert the optimistic update and set the influencer to 'To Contact', delete the sequence_emails, and cancel outgoing emails in the outbox */
const handleSendFailed = async (sequenceInfluencer: SequenceInfluencerManagerPage, outbox: OutboxGetMessage[]) => {
    if (sequenceInfluencer.sequence_step !== 0) {
        // only reset the sequence influencer if it fails on the first step
        return;
    }
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

export const SequenceStepSendEvent: JobInterface<'sequence_step_send', SequenceSendEventRun> = {
    name: 'sequence_step_send',
    run: async (payload) => {
        // 4 minutes and 30 seconds. Make this lower than /api/jobs/run maxDuration to trigger sentry
        const maxRunTime = 1000 * 270;

        const { result, success } = await maxExecutionTime(sendSequenceStep(payload), maxRunTime);

        if (!success) {
            throw new Error('Sequence send job failed. result: ' + JSON.stringify(result));
        }

        return result;
    },
};
