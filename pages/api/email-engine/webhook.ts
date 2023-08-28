import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import type { SequenceEmailUpdate, SequenceInfluencer, SequenceInfluencerUpdate } from 'src/utils/api/db';
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

import { EmailClicked, EmailComplaint, EmailFailed, EmailOpened, EmailReply, EmailSent } from 'src/utils/analytics/events';
import type { EmailReplyPayload } from 'src/utils/analytics/events/outreach/email-reply';
import type { EmailSentPayload } from 'src/utils/analytics/events/outreach/email-sent';
import { getProfileByEmailEngineAccountQuery } from 'src/utils/api/db/calls/profiles';
import {
    getSequenceInfluencerByEmailAndCompanyCall,
    getSequenceInfluencerByIdCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { serverLogger } from 'src/utils/logger-server';
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

const deleteScheduledEmail = async (event: WebhookMessageNew) => {
    try {
        const outbox = await getOutbox();
        // If there is a sequenced email in the outbox to this address, cancel it
        if (outbox.messages.some((message) => message.envelope.to.includes(event.data.from.address))) {
            const message = outbox.messages.find((message) => message.envelope.to.includes(event.data.from.address));
            if (!message) {
                return;
            }
            const { deleted } = await deleteEmailFromOutbox(message.queueId);

            await deleteSequenceEmailByMessageId(message.messageId);

            await supabaseLogger({
                type: 'email-webhook',
                data: event as any,
                message: `${deleted ? 'canceled' : 'failed to cancel'} email to: ${JSON.stringify(
                    message.envelope.to,
                )}`,
            });
        }
    } catch (error) {
        await supabaseLogger({
            type: 'email-webhook',
            data: event as any,
            message: `failed to cancel an email to: ${event.data.from.address}`,
        });
        serverLogger(error, 'error');
    }
};
const handleReply = async (sequenceInfluencer: SequenceInfluencer, event: WebhookMessageNew) => {
    await deleteScheduledEmail(event);
    // Outgoing emails should have been deleted. This will update the remaining emails to "replied" and the influencer to "negotiating
    const sequenceEmails = await getSequenceEmailsBySequenceInfluencer(sequenceInfluencer.id);
    await supabaseLogger({
        type: 'email-webhook',
        data: { sequenceEmails } as any,
        message: `reply from: sequenceEmails`,
    });
    const emailUpdates: SequenceEmailUpdate[] = sequenceEmails.map((sequenceEmail) => ({
        id: sequenceEmail.id,
        email_delivery_status: 'Replied',
    }));
    await supabaseLogger({
        type: 'email-webhook',
        data: { emailUpdates } as any,
        message: `reply from: emailUpdates`,
    });
    for (const emailUpdate of emailUpdates) {
        try {
            await updateSequenceEmail(emailUpdate);
        } catch (error) {
            await supabaseLogger({
                type: 'email-webhook',
                data: { error } as any,
                message: `reply from: updateSequenceEmail error`,
            });
        }
    }

    const influencerUpdate: SequenceInfluencerUpdate = { id: sequenceInfluencer.id, funnel_status: 'Negotiating' };
    await supabaseLogger({
        type: 'email-webhook',
        data: { influencerUpdate } as any,
        message: `reply from: influencerUpdate`,
    });
    await updateSequenceInfluencer(influencerUpdate);
    await supabaseLogger({
        type: 'email-webhook',
        data: { event, emailUpdates, influencerUpdate } as any,
        message: `reply from: ${event.data.from.address}`,
    });
};

const handleNewEmail = async (event: WebhookMessageNew, res: NextApiResponse) => {
    const trackData: Omit<EmailReplyPayload, 'is_success'> = {
        account_id: event.account,
        sequence_influencer_id: null,
        influencer_id: null,
        sequence_step: null,
        extra_info: event.data,
    }

    if (event.data.messageSpecialUse === GMAIL_SENT_SPECIAL_USE_FLAG) {
        // For some reason, sent mail also shows up in `messageNew`, so filter them out.
        // TODO: find a more general, non-hardcoded way to do this that will work for non-gmail providers.
        return res.status(httpCodes.OK).json({});
    }
    try {
        const { data: ourUser, error } = await getProfileBySequenceSendEmail(event.data.to[0].address);
        if (error) {
            track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
                ...trackData,
                is_success: false,
            })

            await supabaseLogger({
                type: 'email-webhook',
                data: event as any,
                message: `newMessage ourUser error: ${error.message}`,
            });
            return res.status(httpCodes.OK).json({});
        }
        const sequenceInfluencer = await getSequenceInfluencerByEmailAndCompany(
            event.data.from.address,
            ourUser?.company_id,
        );
        if (!sequenceInfluencer) {
            track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
                ...trackData,
                is_success: false,
            })

            await supabaseLogger({
                type: 'email-webhook',
                data: event as any,
                message: `newMessage sequenceInfluencer not found from: ${event.data.from.address}`,
            });
            return res.status(httpCodes.OK).json({});
        }

        trackData.sequence_influencer_id = sequenceInfluencer.id;
        trackData.influencer_id = sequenceInfluencer.influencer_social_profile_id;
        trackData.sequence_step = sequenceInfluencer.sequence_step;

        await handleReply(sequenceInfluencer, event);

        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
            ...trackData,
            is_success: true,
        })
    } catch (error) {
        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailReply, {
            ...trackData,
            is_success: false,
        })
    }

    return res.status(httpCodes.OK).json({});
};

const handleTrackClick = async (event: WebhookTrackClick, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = { id: sequenceEmail.id, email_tracking_status: 'Link Clicked' };
    await updateSequenceEmail(update);

    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailClicked, {
        account_id: event.account,
        sequence_email_id: sequenceEmail.id,
        extra_info: event.data
    })

    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `trackClick url: ${event.data.url}`,
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
        extra_info: event.data
    })

    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `trackOpen messageId: ${event.data.messageId}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleBounce = async (event: WebhookMessageBounce, res: NextApiResponse) => {
    try {
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
        const update: SequenceEmailUpdate = {
            id: sequenceEmail.id,
            email_delivery_status: 'Bounced',
        };

        await updateSequenceEmail(update);

        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailFailed, {
            account_id: event.account,
            sequence_email_id: sequenceEmail.id,
            error_type: 'bounced',
            extra_info: event.data
        })

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update } as any,
            message: `bounce messageId: ${event.data.messageId}`,
        });
    } catch {
        // @note sequence email is missing; probably deleted manually.
    }

    return res.status(httpCodes.OK).json({});
};

const handleComplaint = async (event: WebhookMessageComplaint, res: NextApiResponse) => {
    track(rudderstack.getClient(), rudderstack.getIdentity())(EmailComplaint, {
        extra_info: event.data
    })

    await supabaseLogger({
        type: 'email-webhook',
        data: event as any,
        message: `complaint complaintMessage: ${event.data.complaintMessage}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleDeliveryError = async (event: WebhookMessageDeliveryError, res: NextApiResponse) => {
    try {
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
            extra_info: event.data
        })

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update } as any,
            message: `deliveryError error: ${event.data.error}`,
        });
    } catch {
        // @note sequence email is missing; probably deleted manually.
    }
    return res.status(httpCodes.OK).json({});
};

const handleFailed = async (event: WebhookMessageFailed, res: NextApiResponse) => {
    try {
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
            extra_info: event.data
        })

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update } as any,
            message: `failed error: ${event.data.error}`,
        });
    } catch {
        // @note sequence email is missing; probably deleted manually.
    }

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
        extra_info: event.data,
    }

    try {
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId); // if there is no matching sequenceEmail, this is a regular email, not a sequenced email and this will throw an error

        trackData.sequence_email_id = sequenceEmail.id
        trackData.sequence_id = sequenceEmail.sequence_id
        trackData.sequence_influencer_id = sequenceEmail.sequence_influencer_id

        const update: SequenceEmailUpdate = {
            id: sequenceEmail.id,
            email_delivery_status: 'Delivered',
        };
        await updateSequenceEmail(update);

        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id);

        trackData.influencer_id = sequenceInfluencer.influencer_social_profile_id
        trackData.sequence_step = sequenceInfluencer.sequence_step + 1

        const sequenceInfluencerUpdate: SequenceInfluencerUpdate = {
            id: sequenceInfluencer.id,
            sequence_step: sequenceInfluencer.sequence_step + 1,
        };
        await updateSequenceInfluencer(sequenceInfluencerUpdate);

        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailSent, {
            ...trackData,
            is_success: true,
        })

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update, sequenceInfluencerUpdate } as any,
            message: `sent to: ${event.data.envelope.to}`,
        });
        return res.status(httpCodes.OK).json({});
    } catch (error: any) {
        track(rudderstack.getClient(), rudderstack.getIdentity())(EmailSent, {
            ...trackData,
            is_success: false,
        })

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, error } as any,
            message: `error sending to: ${event.data.envelope.to}. error: ${error?.message}`,
        });

        // @todo replying from inbox is not associated with a sequence email
        // this will cause a 500 which will cause EE to resend this webhook every time
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

const handleOtherWebhook = async (event: WebhookEvent, res: NextApiResponse) => {
    await supabaseLogger({ type: 'email-webhook', data: event as any, message: `otherWebhook event: ${event.event}` });
    return res.status(httpCodes.OK).json({});
};

const identifyWebhook = async (body: WebhookEvent) => {
    try {
        const profile = await db(getProfileByEmailEngineAccountQuery)(body.account)

        if (!profile) {
            throw new RelayError(`No account associated with "${body.account}"`, 500, {
                shouldLog: true,
                sendToSentry: true
            })
        }

        rudderstack.identifyWithProfile(profile.id)
    } catch (e) {
        throw e;
    }
}

export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req, res) => {
    // TODO: use a signing secret from the email client to authenticate the request
    const body = req.body as WebhookEvent;

    await identifyWebhook(body)

    await supabaseLogger({ type: 'email-webhook', data: body as any, message: `incoming: ${body.event}` });
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
};

export default ApiHandler({ postHandler });
