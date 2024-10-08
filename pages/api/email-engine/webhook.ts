import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { ProfileDB, SequenceEmail, SequenceInfluencer, SequenceInfluencerUpdate } from 'src/utils/api/db';
import { getProfileBySequenceSendEmail, supabaseLogger } from 'src/utils/api/db';
import {
    deleteSequenceEmailByMessageIdCall,
    getSequenceEmailByInfluencerAndSequenceStep,
    getSequenceEmailByMessageIdCall,
    getSequenceEmailsBySequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-emails';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { GMAIL_SENT_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { db } from 'src/utils/supabase-client';
import {
    EmailClicked,
    EmailComplaint,
    EmailFailed,
    EmailOpened,
    EmailReply,
    EmailSent,
} from 'src/utils/analytics/events';
import type { EmailReplyPayload } from 'src/utils/analytics/events/outreach/email-reply';
import type { EmailSentPayload } from 'src/utils/analytics/events/outreach/email-sent';
import {
    getSequenceInfluencerByEmailAndCompanyCall,
    getSequenceInfluencerByIdCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { WebhookMessageBounce } from 'types/email-engine/webhook-message-bounce';
import type { WebhookMessageComplaint } from 'types/email-engine/webhook-message-complaint';
import type { WebhookMessageDeliveryError } from 'types/email-engine/webhook-message-delivery-error';
import type { WebhookMessageFailed } from 'types/email-engine/webhook-message-failed';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';
import type { WebhookMessageSent } from 'types/email-engine/webhook-message-sent.ts';
import type { WebhookTrackClick } from 'types/email-engine/webhook-track-click';
import type { WebhookTrackOpen } from 'types/email-engine/webhook-track-open';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
import type { EmailNewPayload } from 'src/utils/analytics/events/outreach/email-new';
import { EmailNew } from 'src/utils/analytics/events/outreach/email-new';
import { serverLogger } from 'src/utils/logger-server';
import type { OutboxGet } from 'types/email-engine/outbox-get';
import type { EmailFailedPayload } from 'src/utils/analytics/events/outreach/email-failed';
import { isPostgrestError, normalizePostgrestError } from 'src/errors/postgrest-error';
import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import { createJob } from 'src/utils/scheduler/utils';
import { now } from 'src/utils/datetime';
import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
import { getTemplateVariablesBySequenceIdCall } from 'src/utils/api/db/calls/template-variables';
import { SEQUENCE_STEP_SEND_QUEUE_NAME } from 'src/utils/scheduler/queues/sequence-step-send';
import { syncEmail } from 'src/utils/outreach/sync-email';
import type { WebhookMessageDeleted } from 'types/email-engine/webhook-message-deleted';
import { deleteEmail } from 'src/utils/outreach/delete-email';
import { v4 } from 'uuid';
import { deleteJobs } from 'src/utils/scheduler/db-queries';
import { isString } from 'src/utils/types';
import type { SequenceEmailUpdate } from 'src/backend/database/sequence-emails';
import { updateSequenceEmailCall } from 'src/backend/database/sequence-emails';
import { insertAddressCall } from 'src/backend/database/addresses';
import awaitToError from 'src/utils/await-to-error';

export type SendEmailPostRequestBody = SendEmailRequestBody & {
    account: string;
};

export type WebhookEvent =
    | WebhookMessageBounce
    | WebhookMessageComplaint
    | WebhookMessageDeliveryError
    | WebhookMessageFailed
    | WebhookMessageNew
    | WebhookMessageSent
    | WebhookMessageDeleted
    | WebhookTrackClick
    | WebhookTrackOpen;

const getSequenceEmailByMessageId = db<typeof getSequenceEmailByMessageIdCall>(getSequenceEmailByMessageIdCall);

const getSequenceEmailsBySequenceInfluencer = db<typeof getSequenceEmailsBySequenceInfluencerCall>(
    getSequenceEmailsBySequenceInfluencerCall,
);

const getSequenceInfluencerById = db<typeof getSequenceInfluencerByIdCall>(getSequenceInfluencerByIdCall);

const getSequenceInfluencerByEmailAndCompany = db<typeof getSequenceInfluencerByEmailAndCompanyCall>(
    getSequenceInfluencerByEmailAndCompanyCall,
);

const updateSequenceInfluencer = db<typeof updateSequenceInfluencerCall>(updateSequenceInfluencerCall);

const deleteSequenceEmailByMessageId = db<typeof deleteSequenceEmailByMessageIdCall>(
    deleteSequenceEmailByMessageIdCall,
);

export const getScheduledMessages = (outbox: OutboxGet['messages'], sequenceEmails: SequenceEmail[]) => {
    return outbox.filter((message) =>
        sequenceEmails.some((sequenceEmail) => sequenceEmail.email_message_id === message.messageId),
    );
};

/** If the error is because of a supabase timeout/overload, we want the webhook to send back an error so it will try again */
export const isFetchFailedError = (error: any) =>
    (typeof error === 'string' && error?.includes('TypeError: fetch failed')) ||
    (typeof error === 'object' && 'message' in error && error.message.includes('TypeError: fetch failed'));

/** Deletes all outgoing, scheduled emails from the outbox for a given influencer */
const deleteScheduledEmails = async (
    trackData: EmailReplyPayload,
    sequenceInfluencer: SequenceInfluencer,
): Promise<EmailReplyPayload> => {
    try {
        const sequenceEmails = await getSequenceEmailsBySequenceInfluencer(sequenceInfluencer.id);
        const sequenceEmailIds = sequenceEmails.map((email) => email.id);

        const jobIds = sequenceEmails.map((email) => email.job_id).filter(isString);
        if (jobIds.length > 0) {
            await db(deleteJobs)(jobIds);
        }

        trackData.sequence_emails_pre_delete = sequenceEmailIds;
        const toDelete = sequenceEmails.filter(
            (email) => email.email_delivery_status === 'Scheduled' || email.email_delivery_status === 'Unscheduled',
        );
        const outbox = await getOutbox();
        // If there are any scheduled emails in the outbox to this address, cancel them
        const scheduledMessages = getScheduledMessages(outbox, toDelete);
        trackData.scheduled_emails = scheduledMessages.map((message) => message.messageId);
        if (scheduledMessages.length === 0) {
            return trackData;
        }
        for (const message of scheduledMessages) {
            try {
                const { deleted } = await deleteEmailFromOutbox(message.queueId);
                if (!deleted) {
                    throw new Error('failed to delete email from outbox');
                }
                await deleteSequenceEmailByMessageId(message.messageId);
                trackData.deleted_emails.push(message.messageId);
            } catch (error: any) {
                trackData.extra_info.email_delete_errors = trackData.extra_info.email_delete_errors || [];
                trackData.extra_info.email_delete_errors.push(`error: ${error?.message}\n stack ${error?.stack}`);
            }
        }
        return trackData;
    } catch (error: any) {
        trackData.extra_info.email_delete_errors = trackData.extra_info.email_delete_errors || [];
        trackData.extra_info.email_delete_errors.push(`error: ${error?.message}\n stack ${error?.stack}`);
        return trackData;
    }
};

const scheduleOutreachEmailRetry = async ({
    event,
    sequenceInfluencer,
    sequenceStep,
    sequenceSteps,
    templateVariables,
}: {
    event: any;
    sequenceInfluencer: any;
    sequenceStep: any;
    sequenceSteps: any;
    templateVariables: any;
}) => {
    const payload: SequenceStepSendArgs = {
        emailEngineAccountId: event.account,
        sequenceInfluencer,
        sequenceStep,
        sequenceSteps,
        templateVariables,
        reference: event.data.messageId,
    };

    // Get existing sequence email retry if it exists
    const { data, error } = await db(getSequenceEmailByInfluencerAndSequenceStep)(
        sequenceInfluencer.id,
        sequenceStep.id,
    );

    if (error) {
        serverLogger(
            `nextEmailError for influencer id: ${sequenceInfluencer.id} and step id: ${sequenceStep.id}`,
            (scope) => {
                return scope.setContext('Error', {
                    error,
                });
            },
        );
    }

    if (!data) {
        serverLogger(
            `no next email record found for influencer id: ${sequenceInfluencer.id} and step id: ${sequenceStep.id}`,
        );
    }

    const jobId = v4();

    const job = await createJob(SEQUENCE_STEP_SEND_QUEUE_NAME, {
        id: jobId,
        queue: SEQUENCE_STEP_SEND_QUEUE_NAME,
        payload,
    });

    // Update existing sequence email retry of the new job
    if (data) {
        await updateSequenceEmailCall(data.id, { job_id: jobId });
    }

    return job;
};

const catchBouncedReplies = async (event: WebhookMessageNew) => {
    /**
     * If the subject of the email contains "Delivery Status Notification", it is a bounce email.
     */
    const subject = event.data.subject?.toLowerCase();
    if (subject.includes('Delivery Status Notification'.toLowerCase())) {
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        const update: SequenceEmailUpdate = [sequenceEmail.id, { email_delivery_status: 'Bounced' }];
        await updateSequenceEmailCall(...update);
    }
};

export const handleReply = async (sequenceInfluencer: SequenceInfluencer, event: WebhookMessageNew) => {
    const { id, influencer_social_profile_id, real_full_name, name, username, address_id } = sequenceInfluencer;

    let trackData: EmailReplyPayload = {
        account_id: event.account,
        sequence_influencer_id: id,
        sequence_emails_pre_delete: [],
        sequence_emails_after_delete: [],
        scheduled_emails: [],
        deleted_emails: [],
        email_updates: [],
        extra_info: { event_data: event.data },
        is_success: false,
    };

    try {
        trackData = await deleteScheduledEmails(trackData, sequenceInfluencer);
        // Outgoing emails should have been deleted. This will update the remaining emails to "replied" and the influencer to "negotiating"
        const sequenceEmails = await getSequenceEmailsBySequenceInfluencer(id);
        trackData.sequence_emails_after_delete = sequenceEmails.map((email) => email.id);

        const emailUpdates: SequenceEmailUpdate[] = sequenceEmails.map((sequenceEmail) => [
            sequenceEmail.id,
            { email_delivery_status: 'Replied' },
        ]);
        trackData.email_updates = emailUpdates.map((update) => update[0] || '');

        for (const emailUpdate of emailUpdates) {
            try {
                await updateSequenceEmailCall(...emailUpdate);
            } catch (error: any) {
                if (isFetchFailedError(error)) {
                    throw error;
                }
                trackData.extra_info.email_update_errors = trackData.extra_info.email_update_errors || [];
                trackData.extra_info.email_update_errors.push(
                    `${JSON.stringify(emailUpdate)} error: ${error?.message}\n stack ${error?.stack}`,
                );
            }
        }

        await awaitToError(catchBouncedReplies(event));

        const influencerUpdate: SequenceInfluencerUpdate = { id, funnel_status: 'Negotiating' };

        // if the sequence_influencer already has an address_id, it means the address has been created.
        if (influencer_social_profile_id && !address_id) {
            try {
                const newAddress = await insertAddressCall()({
                    name: real_full_name || name || username || '',
                    country: '',
                    state: '',
                    city: '',
                    postal_code: '',
                    address_line_1: '',
                    influencer_social_profile_id,
                });
                influencerUpdate.address_id = newAddress.id;
            } catch (error: any) {
                serverLogger(error);
            }
        }

        const update = await updateSequenceInfluencer(influencerUpdate);
        trackData.extra_info.influencer_update = update;
        trackData.is_success = true;
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
        trackData.is_success = false;
    } finally {
        await createJob('track_analytics_event', {
            queue: 'analytics',
            payload: {
                account: event.account,
                eventName: EmailReply.eventName,
                eventPayload: trackData,
                eventTimestamp: now(),
            },
        });
    }
};

const handleNewEmail = async (event: WebhookMessageNew, res: NextApiResponse) => {
    const synced = await syncEmail({
        account: event.account,
        emailEngineId: event.data.id,
    });

    // We sometimes receive a messageNew event when an email is trashed
    if (synced.messageType.type === 'Trash') {
        return res.status(httpCodes.OK).json({ message: 'ok' });
    }

    if (synced.messageType.type === 'Reply' && synced.influencer) {
        await handleReply(synced.influencer, event);
        return res.status(httpCodes.OK).json({ message: 'ok' });
    }

    const trackData: Omit<EmailNewPayload, 'is_success'> = {
        account_id: event.account,
        profile_id: null,
        extra_info: { event_data: event.data },
    };
    const fromAddress = event.data.from.address?.toLowerCase();
    const toAddresses = event.data.to ? event.data.to.map((a) => a.address?.toLowerCase().trim()) : [];
    if (event.data.cc) {
        toAddresses.push(...event.data.cc.map((a) => a.address?.toLowerCase().trim()));
    }

    // Ignore outgoing emails and drafts
    if (
        toAddresses.length === 0 ||
        event.data.messageSpecialUse === GMAIL_SENT_SPECIAL_USE_FLAG ||
        event.data.draft === true ||
        fromAddress.includes('boostbot.ai') ||
        fromAddress.includes('noreply') ||
        fromAddress.includes('no-reply')
    ) {
        if (toAddresses.length === 0) {
            createJob('track_analytics_event', {
                queue: 'analytics',
                payload: {
                    account: event.account,
                    eventName: EmailNew.eventName,
                    eventPayload: {
                        ...trackData,
                        is_success: false, // an incoming email with no to address is strange
                    },
                    eventTimestamp: now(),
                },
            });
        }
        return res.status(httpCodes.OK).json({});
    }

    let ourUser: ProfileDB | null = null;
    let findUserError = '';
    for (const toAddress of toAddresses) {
        const { data: foundUser, error } = await getProfileBySequenceSendEmail(toAddress);
        if (foundUser) {
            ourUser = foundUser;
            break;
        }
        findUserError += ` Find user error, address: ${toAddress}, error: ${error?.message} ` ?? '';
    }
    if (isFetchFailedError(findUserError)) {
        throw findUserError;
    }

    // If there are multiple users at the same company with the same email address, this will get the first one. We only use it to supply a `company_id`, so it doesn't matter which user we get as long as the email is unique per company.
    if (!ourUser) {
        trackData.extra_info.error = 'Unable to find user with matching sequence send email: ' + `${findUserError}`;

        await createJob('track_analytics_event', {
            queue: 'analytics',
            payload: {
                account: event.account,
                eventName: EmailNew.eventName,
                eventPayload: {
                    ...trackData,
                    is_success: false, // an incoming email that isn't associated with any user account is strange
                },
                eventTimestamp: now(),
            },
        });
        return res.status(httpCodes.OK).json({});
    }
    trackData.profile_id = ourUser.id;

    try {
        const sequenceInfluencer = await getSequenceInfluencerByEmailAndCompany(fromAddress, ourUser.company_id);
        // try other ways to find the influencer.
        // use the threadid and look for emails sent to the same threadid.
        // use the inReplyTo messageId to look for outgoing emails with the same messageId.

        // if there is a sequenceInfluencer, this is a reply to a sequenced email
        await handleReply(sequenceInfluencer, event);
        return res.status(httpCodes.OK).json({});
    } catch (error: any) {
        trackData.extra_info.error =
            'Sequence influencer not found:' + `error: ${error?.message}\n stack ${error?.stack}`;

        if (isFetchFailedError(error)) {
            throw error;
        }
        // Don't want to lose a record of this entirely, but it generally isn't important, cause it just means it is a reply to a regular email, not a sequenced email
        await supabaseLogger({ type: 'email-webhook', message: trackData.extra_info.error, data: trackData });
        return res.status(httpCodes.OK).json({});
    }
};

const handleTrackClick = async (event: WebhookTrackClick, res: NextApiResponse) => {
    let sequenceEmail: SequenceEmail | null = null;
    let update: SequenceEmailUpdate | null = null;
    let is_success = false;
    let errorMessage: string | null = null;
    try {
        sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        update = [sequenceEmail.id, { email_tracking_status: 'Link Clicked' }];
        await updateSequenceEmailCall(...update);
        is_success = true;
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        errorMessage = `error: ${error?.message}\n stack ${error?.stack}`;
        serverLogger(errorMessage);
    }

    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailClicked.eventName,
            eventPayload: {
                account_id: event.account,
                sequence_email_id: sequenceEmail?.id,
                extra_info: { event_data: event.data, update },
                is_success,
            },
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleTrackOpen = async (event: WebhookTrackOpen, res: NextApiResponse) => {
    let sequenceEmail: SequenceEmail | null = null;
    let update: SequenceEmailUpdate | null = null;
    let is_success = false;
    let errorMessage: string | null = null;

    try {
        sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        update = [sequenceEmail.id, { email_tracking_status: 'Opened' }];
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        errorMessage = `error: ${error?.message}\n stack ${error?.stack}`;
        serverLogger(errorMessage);
    }

    try {
        if (update) {
            await updateSequenceEmailCall(...update);
            is_success = true;
        }
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        errorMessage = `error: ${error?.message}\n stack ${error?.stack}`;
        serverLogger(errorMessage);
    }

    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailOpened.eventName,
            eventPayload: {
                account_id: event.account,
                sequence_email_id: sequenceEmail?.id,
                extra_info: { event_data: event.data, update },
                is_success,
            },
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleBounce = async (event: WebhookMessageBounce, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = [sequenceEmail.id, { email_delivery_status: 'Bounced' }];
    let trackData: EmailFailedPayload = {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        error_type: 'bounced',
        extra_info: { event_data: event.data, update, email_delete_errors: null },
        is_success: false,
        sequence_influencer_id: null,
        sequence_emails_pre_delete: [],
        sequence_emails_after_delete: [],
        scheduled_emails: [],
        deleted_emails: [],
        email_updates: [],
    };

    try {
        await updateSequenceEmailCall(...update);

        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id);
        trackData.sequence_influencer_id = sequenceInfluencer.id;
        trackData = (await deleteScheduledEmails(trackData as any, sequenceInfluencer)) as any; // deleteScheduledEmails requires another Payload type and it is too troublesome to get it to accept both Payload types. I've confirmed that the keys set in deleteScheduledEmails won't be undefined.
        trackData.is_success = true;
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
    }

    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailFailed.eventName,
            eventPayload: trackData,
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleComplaint = async (event: WebhookMessageComplaint, res: NextApiResponse) => {
    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailComplaint.eventName,
            eventPayload: {
                extra_info: { event_data: event.data },
            },
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleDeliveryError = async (event: WebhookMessageDeliveryError, res: NextApiResponse) => {
    let sequenceEmail: SequenceEmail | null = null;
    let update: SequenceEmailUpdate | null = null;
    let is_success = false;
    let errorMessage = null;
    try {
        sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        update = [sequenceEmail.id, { email_delivery_status: 'Failed' }];

        await updateSequenceEmailCall(...update);
        is_success = true;
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        errorMessage = `error: ${error?.message}\n stack ${error?.stack}`;
        serverLogger(errorMessage);
    }
    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailFailed.eventName,
            eventPayload: {
                account_id: event.account,
                sequence_email_id: sequenceEmail?.id,
                error_type: 'failed',
                extra_info: { event_data: event.data, update },
                is_success,
            },
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleFailed = async (event: WebhookMessageFailed, res: NextApiResponse) => {
    let sequenceEmail: SequenceEmail | null = null;
    let update: SequenceEmailUpdate | null = null;
    let is_success = false;
    let errorMessage: string | null = null;
    try {
        sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        update = [sequenceEmail.id, { email_delivery_status: 'Failed' }];
        await updateSequenceEmailCall(...update);
        is_success = true;
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        errorMessage = `error: ${error?.message}\n stack ${error?.stack}`;
        serverLogger(errorMessage);
    }

    await createJob('track_analytics_event', {
        queue: 'analytics',
        payload: {
            account: event.account,
            eventName: EmailFailed.eventName,
            eventPayload: {
                account_id: event.account,
                sequence_email_id: sequenceEmail?.id,
                error_type: 'quit',
                extra_info: { event_data: event.data, update },
                is_success,
            },
            eventTimestamp: now(),
        },
    });

    return res.status(httpCodes.OK).json({});
};

const handleSent = async (event: WebhookMessageSent, res: NextApiResponse) => {
    const trackData: EmailSentPayload = {
        account_id: event.account,
        sequence_email_id: null,
        sequence_id: null,
        sequence_influencer_id: null,
        influencer_id: null,
        sequence_step: null,
        sequence_step_id: null,
        extra_info: {
            event_data: event.data,
            sequenceEmail: null,
            sequenceEmailUpdate: null,
            sequenceInfluencerUpdate: null,
            sequenceSteps: null,
            currentStep: null,
        },
        is_success: false,
    };

    try {
        // if there is no matching sequenceEmail, this is a regular email, not a sequenced email and this will throw an error
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        trackData.extra_info.sequenceEmail = sequenceEmail;

        if (!sequenceEmail || !sequenceEmail.sequence_id) {
            throw new Error('no sequence email found');
        }

        trackData.sequence_email_id = sequenceEmail.id;
        trackData.sequence_id = sequenceEmail.sequence_id;
        trackData.sequence_influencer_id = sequenceEmail.sequence_influencer_id;

        // likewise will fail if there is no sequenceInfluencer
        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id);

        trackData.influencer_id = sequenceInfluencer.influencer_social_profile_id;
        trackData.sequence_step = sequenceInfluencer.sequence_step;

        const sequenceEmailUpdate: SequenceEmailUpdate = [
            sequenceEmail.id,
            {
                email_delivery_status: 'Delivered',
                email_send_at: new Date().toISOString(),
            },
        ];

        await updateSequenceEmailCall(...sequenceEmailUpdate);
        trackData.extra_info.sequenceEmailUpdate = sequenceEmailUpdate;

        const sequenceSteps = await db<typeof getSequenceStepsBySequenceIdCall>(getSequenceStepsBySequenceIdCall)(
            sequenceEmail.sequence_id,
        );
        trackData.extra_info.sequenceSteps = sequenceSteps;
        if (!sequenceSteps || sequenceSteps.length === 0) {
            throw new Error('No sequence steps found');
        }

        const currentStep = sequenceSteps.find((step) => step.id === sequenceEmail.sequence_step_id);
        trackData.extra_info.currentStep = currentStep;
        if (typeof currentStep?.step_number !== 'number') {
            throw new Error('No sequence step found');
        }
        const isValidUpdate = currentStep.step_number > sequenceInfluencer.sequence_step;

        trackData.sequence_step = currentStep.step_number;
        trackData.sequence_step_id = currentStep.id;
        trackData.extra_info.sequence_steps_length = sequenceSteps.length;

        const sequenceInfluencerUpdate: SequenceInfluencerUpdate = {
            id: sequenceInfluencer.id,
            sequence_step: currentStep.step_number,
        };

        if (isValidUpdate) {
            await updateSequenceInfluencer(sequenceInfluencerUpdate);
            trackData.extra_info.sequenceInfluencerUpdate = sequenceInfluencerUpdate;
        }

        trackData.is_success = true;

        // schedule next outreach email
        if (sequenceSteps.length > currentStep.step_number + 1) {
            const nextStep = sequenceSteps.find((step) => step.step_number === currentStep.step_number + 1);

            if (!nextStep) {
                throw new Error('No next sequence step found');
            }

            const templateVariables = await db(getTemplateVariablesBySequenceIdCall)(sequenceEmail.sequence_id);

            trackData.extra_info.next_sequence_email_payload = {
                emailEngineAccountId: event.account,
                sequenceInfluencer: { ...sequenceInfluencer, sequence_step: currentStep.step_number },
                sequenceStep: nextStep,
                sequenceSteps,
                templateVariables,
                reference: event.data.messageId,
            };

            const jobCreated = await scheduleOutreachEmailRetry({
                event,
                sequenceInfluencer: { ...sequenceInfluencer, sequence_step: currentStep.step_number },
                sequenceStep: nextStep,
                sequenceSteps,
                templateVariables,
            });

            trackData.extra_info.job_created = jobCreated;
            trackData.is_success = jobCreated !== false;
        } else {
            trackData.is_success = true;
        }
    } catch (error: any) {
        if (isFetchFailedError(error)) {
            throw error;
        }
        if (trackData.sequence_email_id) {
            // If we don't have a sequence_email_id, this is a regular email, not a sequenced email and we don't want to track it
            trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
            trackData.is_success = false;
        }
    } finally {
        if (trackData.sequence_email_id) {
            await createJob('track_analytics_event', {
                queue: 'analytics',
                payload: {
                    account: event.account,
                    eventName: EmailSent.eventName,
                    eventPayload: trackData,
                    eventTimestamp: now(),
                },
            });
        }
    }

    return res.status(httpCodes.OK).json({});
};

const handleMessageDeleted = async (event: WebhookMessageDeleted, res: NextApiResponse) => {
    await deleteEmail(event.account, event.data.id);

    return res.status(httpCodes.OK).json({ message: 'ok' });
};

const handleOtherWebhook = async (_event: WebhookEvent, res: NextApiResponse) => {
    return res.status(httpCodes.OK).json({});
};

// @note
//  messageUpdate happens on seen/unseen, "toggling a star"
//  adding a reaction triggers messageNew and messageUpdated
const ignoredWebhooks = ['messageUpdated'];

export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req, res) => {
    // TODO: use a signing secret from the email client to authenticate the request
    const body = req.body as WebhookEvent;

    if (ignoredWebhooks.includes(body.event)) {
        return res.status(httpCodes.OK).json({});
    }

    try {
        await identifyAccount(body?.account);

        switch (body.event) {
            case 'messageNew':
                return handleNewEmail(body, res);
            case 'trackClick':
                return handleTrackClick(body, res);
            case 'trackOpen':
                return handleTrackOpen(body, res);
            case 'messageBounce':
                return handleBounce(body, res);
            case 'messageComplaint':
                return handleComplaint(body, res);
            case 'messageDeliveryError':
                return handleDeliveryError(body, res);
            case 'messageFailed':
                return handleFailed(body, res);
            case 'messageSent':
                return handleSent(body, res);
            case 'messageDeleted':
                return handleMessageDeleted(body, res);
            default:
                return handleOtherWebhook(body, res);
        }
    } catch (error: any) {
        if (isPostgrestError(error)) {
            error = normalizePostgrestError(error);
        }

        serverLogger(error, (scope) => scope.setContext('Webhook Payload', req.body));

        if (isFetchFailedError(error)) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.OK).json({});
};

export default ApiHandler({ postHandler });
