import { SequenceSend, type SequenceSendPayload } from 'src/utils/analytics/events/outreach/sequence-send';
import type { SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import {
    deleteSequenceEmailsByInfluencerCall,
    getSequenceEmailsByEmailEngineAccountId,
    getSequenceEmailsBySequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-emails';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';

import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { sendTemplateEmail } from 'src/utils/api/email-engine/send-template-email';
import { gatherMessageIds } from 'src/utils/api/email-engine/thread-helpers';
import { crumb, serverLogger } from 'src/utils/logger-server';
import { rudderstack, track } from 'src/utils/rudderstack/rudderstack';
import { db } from 'src/utils/supabase-client';
import type { OutboxGetMessage } from 'types/email-engine/outbox-get';
import type { JobInterface } from '../types';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import type { SendResult } from 'pages/api/sequence/send';
import { maxExecutionTimeAndMemory } from 'src/utils/max-execution-time';
import type { EmailCountPerDayPerStep } from 'src/utils/api/email-engine/schedule-emails';
import { scheduleEmails } from 'src/utils/api/email-engine/schedule-emails';
import { insertSequenceEmailsCall, updateSequenceEmailCall } from 'src/backend/database/sequence-emails';

export type SequenceStepSendArgs = {
    emailEngineAccountId: string;
    sequenceInfluencer: SequenceInfluencerManagerPage;
    sequenceStep: SequenceStep;
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
    reference?: string;
    /** only send the job id for the first step. subsequent step's job id will be added in the handleSent webhook. */
    jobId?: string;
};

type SequenceSendEventRun = (payload: SequenceStepSendArgs) => Promise<SendResult>;

/**
 *  if step 0, insert all 4 sequence_email records
 *  else if step > 0, update the existing sequence_email record
 */
const sendAndInsertEmail = async ({
    step,
    sequenceSteps,
    account,
    influencer,
    templateVariables,
    messageId,
    references,
    scheduledEmails,
    jobId,
}: {
    step: SequenceStep;
    sequenceSteps: SequenceStep[];
    influencer: SequenceInfluencerManagerPage;
    account: string;
    templateVariables: TemplateVariable[];
    messageId: string;
    references: string;
    scheduledEmails: EmailCountPerDayPerStep;
    jobId?: string;
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

    let existingSequenceEmails: SequenceEmail[] = [];
    try {
        existingSequenceEmails = await db(getSequenceEmailsBySequenceInfluencerCall)(influencer.id);
    } catch (error) {
        serverLogger(error);
    }
    const existingSequenceEmail = existingSequenceEmails.find((email) => email.sequence_step_id === step.id);
    crumb({
        message: `existingSequenceEmail: ${JSON.stringify(existingSequenceEmail)}, influencer funnel_status ${
            influencer.funnel_status
        }`,
    });
    if (
        existingSequenceEmail &&
        existingSequenceEmail.email_delivery_status &&
        existingSequenceEmail.email_delivery_status !== 'Unscheduled'
    ) {
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

    if (step.step_number === 0) {
        const { outreachStepInsert, followupEmailInserts } = scheduleEmails(
            sequenceSteps,
            scheduledEmails,
            influencer,
            account,
        );

        if (!outreachStepInsert || !outreachStepInsert.email_send_at) {
            throw new Error('No outreach step insert');
        }
        outreachStepInsert.job_id = jobId; // other job ids will be added in handleSent webhook

        const res = await sendTemplateEmail({
            account,
            toEmail: { name: influencerAccountName, address: influencer.email },
            template: step.template_id,
            sendAt: outreachStepInsert.email_send_at,
            params,
            messageId,
            references,
        });

        if ('error' in res) {
            throw new Error(res.error);
        }
        crumb({ message: `sent outreach email` });
        outreachStepInsert.email_delivery_status = 'Scheduled';
        outreachStepInsert.email_message_id = res.messageId;
        await insertSequenceEmailsCall([outreachStepInsert, ...followupEmailInserts]);
        crumb({ message: `inserted sequence emails` });
    } else {
        if (!existingSequenceEmail || !existingSequenceEmail.email_send_at) {
            serverLogger(new Error('No existing sequence email found')); // This should eventually stop happening as all sequences use the new 'schedule all emails at once' method. Then we can remove this whole if block and just throw an error
            const { followupEmailInserts } = scheduleEmails(sequenceSteps, scheduledEmails, influencer, account);
            const thisEmail = followupEmailInserts.find((e) => e.sequence_step_id === step.id);
            const email_send_at = thisEmail?.email_send_at;
            if (!email_send_at) {
                throw new Error(
                    `No email send at for step ${step.step_number}, thisEmail ${thisEmail} followupEmailInserts ${followupEmailInserts}`,
                );
            }
            const res = await sendTemplateEmail({
                account,
                toEmail: { name: influencerAccountName, address: influencer.email },
                template: step.template_id,
                sendAt: email_send_at,
                params,
                messageId,
                references,
            });

            if ('error' in res) {
                throw new Error(res.error);
            }
            await insertSequenceEmailsCall([
                {
                    sequence_influencer_id: influencer.id,
                    sequence_id: influencer.sequence_id,
                    email_engine_account_id: account,
                    sequence_step_id: step.id,

                    email_delivery_status: 'Scheduled',
                    email_message_id: res.messageId,
                    email_send_at,
                },
            ]);
            crumb({ message: `inserted sequence email` });
            return { sequenceInfluencerId: influencer.id, stepNumber: step.step_number };
        } else {
            const res = await sendTemplateEmail({
                account,
                toEmail: { name: influencerAccountName, address: influencer.email },
                template: step.template_id,
                sendAt: existingSequenceEmail.email_send_at,
                params,
                messageId,
                references,
            });

            if ('error' in res) {
                throw new Error(res.error);
            }
            crumb({ message: `sent followup email` });

            await updateSequenceEmailCall(existingSequenceEmail.id, {
                email_delivery_status: 'Scheduled',
                email_message_id: res.messageId,
            });
            crumb({ message: `updated sequence email` });
        }
    }

    return { sequenceInfluencerId: influencer.id, stepNumber: step.step_number };
};

const sendSequenceStep = async ({
    emailEngineAccountId: account,
    sequenceInfluencer: influencer,
    sequenceStep: step,
    sequenceSteps,
    templateVariables,
    reference,
    jobId,
}: SequenceStepSendArgs) => {
    const trackData: SequenceSendPayload = {
        sequence_influencer_id: influencer.id,
        account,
        is_success: false,
        extra_info: {
            sequence_step: step.id,
            template_variables: templateVariables.map((variable) => variable.id),
            jobId,
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

        crumb({ message: 'Get scheduled emails' });
        const scheduledEmails = await db(getSequenceEmailsByEmailEngineAccountId)(account);

        crumb({ message: `Create step ${step.step_number}` });
        try {
            await sendAndInsertEmail({
                step,
                sequenceSteps,
                account,
                influencer,
                templateVariables,
                references: reference ?? '',
                messageId: messageIds[step.step_number],
                scheduledEmails,
                jobId,
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

        const { result, success } = await maxExecutionTimeAndMemory(sendSequenceStep(payload), maxRunTime);

        if (!success) {
            throw new Error('Sequence send job failed. result: ' + JSON.stringify(result));
        }

        return result;
    },
};
