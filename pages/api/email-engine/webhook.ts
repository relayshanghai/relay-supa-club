import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type {
    SequenceEmail,
    SequenceEmailUpdate,
    SequenceInfluencer,
    SequenceInfluencerUpdate,
} from 'src/utils/api/db';
import { getProfileBySequenceSendEmail, supabaseLogger } from 'src/utils/api/db';
import {
    deleteSequenceEmailByMessageIdCall,
    getSequenceEmailByMessageIdCall,
    getSequenceEmailsBySequenceInfluencerCall,
    updateSequenceEmailCall,
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
import { rudderstack, track } from 'src/utils/rudderstack/rudderstack';
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
    | WebhookTrackClick
    | WebhookTrackOpen;

const getSequenceEmailByMessageId = db<typeof getSequenceEmailByMessageIdCall>(getSequenceEmailByMessageIdCall);

const getSequenceEmailsBySequenceInfluencer = db<typeof getSequenceEmailsBySequenceInfluencerCall>(
    getSequenceEmailsBySequenceInfluencerCall,
);

const getSequenceInfluencerById = db<typeof getSequenceInfluencerByIdCall>(getSequenceInfluencerByIdCall);

const updateSequenceEmail = db<typeof updateSequenceEmailCall>(updateSequenceEmailCall);

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
/** Deletes all outgoing, scheduled emails from the outbox for a given influencer */
const deleteScheduledEmails = async (
    trackData: Omit<EmailReplyPayload, 'is_success'>,
    sequenceInfluencer: SequenceInfluencer,
): Promise<Omit<EmailReplyPayload, 'is_success'>> => {
    try {
        // we only want to delete emails that are for sequence_steps/sequence_emails that are connected to the `to` (our) user's company. Otherwise this will delete emails of other users to this same influencer.
        const sequenceEmails = await getSequenceEmailsBySequenceInfluencer(sequenceInfluencer.id);
        trackData.sequence_emails_pre_delete = sequenceEmails.map((email) => email.id);
        const toDelete = sequenceEmails.filter((email) => email.email_delivery_status === 'Scheduled');
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

const handleReply = async (sequenceInfluencer: SequenceInfluencer, event: WebhookMessageNew) => {
    let trackData: Omit<EmailReplyPayload, 'is_success'> = {
        account_id: event.account,
        sequence_influencer_id: sequenceInfluencer.id,
        sequence_emails_pre_delete: [],
        sequence_emails_after_delete: [],
        scheduled_emails: [],
        deleted_emails: [],
        email_updates: [],
        extra_info: { event_data: event.data },
    };
    try {
        trackData = await deleteScheduledEmails(trackData, sequenceInfluencer);
        // Outgoing emails should have been deleted. This will update the remaining emails to "replied" and the influencer to "negotiating"
        const sequenceEmails = await getSequenceEmailsBySequenceInfluencer(sequenceInfluencer.id);
        trackData.sequence_emails_after_delete = sequenceEmails.map((email) => email.id);

        const emailUpdates: SequenceEmailUpdate[] = sequenceEmails.map((sequenceEmail) => ({
            id: sequenceEmail.id,
            email_delivery_status: 'Replied',
        }));
        trackData.email_updates = emailUpdates.map((update) => update.id || '');

        for (const emailUpdate of emailUpdates) {
            try {
                await updateSequenceEmail(emailUpdate);
            } catch (error: any) {
                trackData.extra_info.email_update_errors = trackData.extra_info.email_update_errors || [];
                trackData.extra_info.email_update_errors.push(
                    `${JSON.stringify(emailUpdate)} error: ${error?.message}\n stack ${error?.stack}`,
                );
            }
        }

        const influencerUpdate: SequenceInfluencerUpdate = { id: sequenceInfluencer.id, funnel_status: 'Negotiating' };

        const update = await updateSequenceInfluencer(influencerUpdate);
        trackData.extra_info.influencer_update = update;
        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
            ...trackData,
            is_success: true,
        });
    } catch (error: any) {
        trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
            ...trackData,
            is_success: false,
        });
    }
};

const handleNewEmail = async (event: WebhookMessageNew, res: NextApiResponse) => {
    const trackData: Omit<EmailNewPayload, 'is_success'> = {
        account_id: event.account,
        profile_id: null,
        extra_info: { event_data: event.data },
    };

    if (event.data.messageSpecialUse === GMAIL_SENT_SPECIAL_USE_FLAG) {
        // For some reason, sent mail also shows up in `messageNew`, so filter them out.
        // TODO: find a more general, non-hardcoded way to do this that will work for non-gmail providers.
        return res.status(httpCodes.OK).json({});
    }

    // If there are multiple users at the same company with the same email address, this will get the first one. We only use it to supply a `company_id`, so it doesn't matter which user we get as long as the email is unique per company.
    const { data: ourUser, error } = await getProfileBySequenceSendEmail(event.data.to[0].address);
    if (error) {
        trackData.extra_info.error = 'Unable to find user with matching sequence send email: ' + `${error?.message}`;

        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailNew, {
            ...trackData,
            is_success: false, // an incoming email that isn't associated with any user account is strange
        });

        return res.status(httpCodes.OK).json({});
    }
    trackData.profile_id = ourUser.id;

    try {
        const sequenceInfluencer = await getSequenceInfluencerByEmailAndCompany(
            event.data.from.address,
            ourUser.company_id,
        );

        // if there is a sequenceInfluencer, this is a reply to a sequenced email
        await handleReply(sequenceInfluencer, event);
        return res.status(httpCodes.OK).json({});
    } catch (error: any) {
        trackData.extra_info.error =
            'Sequence influencer not found:' + `error: ${error?.message}\n stack ${error?.stack}`;

        // Don't want to lose a record of this entirely, but it generally isn't important, cause it just means it is a reply to a regular email, not a sequenced email
        await supabaseLogger({ type: 'email-webhook', message: trackData.extra_info.error, data: trackData });

        return res.status(httpCodes.OK).json({});
    }
};

const handleTrackClick = async (event: WebhookTrackClick, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = { id: sequenceEmail.id, email_tracking_status: 'Link Clicked' };
    await updateSequenceEmail(update);

    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailClicked, {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        extra_info: { event_data: event.data, update },
    });

    return res.status(httpCodes.OK).json({});
};

const handleTrackOpen = async (event: WebhookTrackOpen, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = {
        id: sequenceEmail.id,
        email_tracking_status: 'Opened',
    };
    await updateSequenceEmail(update);

    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailOpened, {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        extra_info: { event_data: event.data, update },
    });

    return res.status(httpCodes.OK).json({});
};

const handleBounce = async (event: WebhookMessageBounce, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = {
        id: sequenceEmail.id,
        email_delivery_status: 'Bounced',
    };
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
        await updateSequenceEmail(update);

        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id);
        trackData.sequence_influencer_id = sequenceInfluencer.id;
        trackData = (await deleteScheduledEmails(trackData as any, sequenceInfluencer)) as any; // deleteScheduledEmails requires another Payload type and it is too troublesome to get it to accept both Payload types. I've confirmed that the keys set in deleteScheduledEmails won't be undefined.
        trackData.is_success = true;
    } catch (error: any) {
        trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
    } finally {
        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailFailed, trackData);
    }
    return res.status(httpCodes.OK).json({});
};

const handleComplaint = async (event: WebhookMessageComplaint, res: NextApiResponse) => {
    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailComplaint, {
        extra_info: { event_data: event.data },
    });

    return res.status(httpCodes.OK).json({});
};

const handleDeliveryError = async (event: WebhookMessageDeliveryError, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = {
        id: sequenceEmail.id,
        email_delivery_status: 'Failed',
    };

    await updateSequenceEmail(update);

    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailFailed, {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        error_type: 'failed',
        extra_info: { event_data: event.data, update },
    });

    return res.status(httpCodes.OK).json({});
};

const handleFailed = async (event: WebhookMessageFailed, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = {
        id: sequenceEmail.id,
        email_delivery_status: 'Failed',
    };

    await updateSequenceEmail(update);

    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailFailed, {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        error_type: 'quit',
        extra_info: { event_data: event.data, update },
    });

    return res.status(httpCodes.OK).json({});
};

const handleSent = async (event: WebhookMessageSent, res: NextApiResponse) => {
    const trackData: Omit<EmailSentPayload, 'is_success'> = {
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
    };

    try {
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId); // if there is no matching sequenceEmail, this is a regular email, not a sequenced email and this will throw an error
        trackData.extra_info.sequenceEmail = sequenceEmail;

        if (!sequenceEmail || !sequenceEmail.sequence_id) {
            throw new Error('no sequence email found');
        }

        trackData.sequence_email_id = sequenceEmail.id;
        trackData.sequence_id = sequenceEmail.sequence_id;
        trackData.sequence_influencer_id = sequenceEmail.sequence_influencer_id;

        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id); // likewise will fail if there is no sequenceInfluencer

        trackData.influencer_id = sequenceInfluencer.influencer_social_profile_id;
        trackData.sequence_step = sequenceInfluencer.sequence_step;

        const sequenceEmailUpdate: SequenceEmailUpdate = {
            id: sequenceEmail.id,
            email_delivery_status: 'Delivered',
            email_send_at: new Date().toISOString(),
        };

        await updateSequenceEmail(sequenceEmailUpdate);
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

        const sequenceInfluencerUpdate: SequenceInfluencerUpdate = {
            id: sequenceInfluencer.id,
            sequence_step: currentStep.step_number,
        };

        if (isValidUpdate) {
            await updateSequenceInfluencer(sequenceInfluencerUpdate);
            trackData.extra_info.sequenceInfluencerUpdate = sequenceInfluencerUpdate;
        }

        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailSent, {
            ...trackData,
            is_success: true,
        });
    } catch (error: any) {
        if (trackData.sequence_email_id) {
            // If we don't have a sequence_email_id, this is a regular email, not a sequenced email and we don't want to track it
            trackData.extra_info.error = `error: ${error?.message}\n stack ${error?.stack}`;
            track(rudderstack.getClient(), rudderstack.getIdentity())(EmailSent, {
                ...trackData,
                is_success: false,
            });
        }
    }

    return res.status(httpCodes.OK).json({});
};

const handleOtherWebhook = async (_event: WebhookEvent, res: NextApiResponse) => {
    await createJob({
        name: 'analytics_tracking_event',
        payload: { account: _event?.account, eventName: _event.event, payload: { data: 'this is a test' } },
        queue: 'blocking',
    });

    return res.status(httpCodes.OK).json({});
};

export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req, res) => {
    // TODO: use a signing secret from the email client to authenticate the request
    const body = req.body as WebhookEvent;

    await identifyAccount(body?.account);

    try {
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
            default:
                return handleOtherWebhook(body, res);
        }
    } catch (error: any) {
        if (isPostgrestError(error)) {
            error = normalizePostgrestError(error);
        }

        serverLogger(error, (scope) => {
            return scope.setContext('Webhook Payload', req.body);
        });
    }

    return res.status(httpCodes.OK).json({});
};

export default ApiHandler({ postHandler });
