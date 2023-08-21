import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { SequenceEmailUpdate, SequenceInfluencerUpdate } from 'src/utils/api/db';
import { supabaseLogger } from 'src/utils/api/db';
import { deleteEmailFromOutbox, getOutbox } from 'src/utils/api/email-engine';
import { GMAIL_SENT_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { getSequenceEmailByMessageIdCall, updateSequenceEmailCall } from 'src/utils/api/db/calls/sequence-emails';

import { db } from 'src/utils/supabase-client';

import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { WebhookMessageBounce } from 'types/email-engine/webhook-message-bounce';
import type { WebhookMessageComplaint } from 'types/email-engine/webhook-message-complaint';
import type { WebhookMessageDeliveryError } from 'types/email-engine/webhook-message-delivery-error';
import type { WebhookMessageFailed } from 'types/email-engine/webhook-message-failed';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';
import type { WebhookMessageSent } from 'types/email-engine/webhook-message-sent.ts';
import type { WebhookTrackClick } from 'types/email-engine/webhook-track-click';
import type { WebhookTrackOpen } from 'types/email-engine/webhook-track-open';
import {
    getSequenceInfluencerByIdCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';

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

const getSequenceInfluencerById = db<typeof getSequenceInfluencerByIdCall>(getSequenceInfluencerByIdCall);

const updateSequenceEmail = db<typeof updateSequenceEmailCall>(updateSequenceEmailCall);

const updateSequenceInfluencer = db<typeof updateSequenceInfluencerCall>(updateSequenceInfluencerCall);

const deleteScheduledEmailIfReplied = async (event: WebhookMessageNew) => {
    const outbox = await getOutbox();
    // If there is a sequenced email in the outbox to this address, cancel it
    if (outbox.messages.some((message) => message.envelope.to.includes(event.data.from.address))) {
        const message = outbox.messages.find((message) => message.envelope.to.includes(event.data.from.address));
        if (!message) {
            return;
        }
        const { deleted } = await deleteEmailFromOutbox(message.queueId);

        await supabaseLogger({
            type: 'email-webhook',
            data: event as any,
            message: `${deleted ? 'canceled' : 'failed to cancel'} email to: ${JSON.stringify(message.envelope.to)}`,
        });
    } else {
        await supabaseLogger({
            type: 'email-webhook',
            data: event as any,
            message: `newMessage from: ${event.data.from.address}`,
        });
    }
};

const handleNewEmail = async (event: WebhookMessageNew, res: NextApiResponse) => {
    if (event.data.messageSpecialUse === GMAIL_SENT_SPECIAL_USE_FLAG) {
        // For some reason, sent mail also shows up in `messageNew`, so filter them out.
        // TODO: find a more general, non-hardcoded way to do this that will work for non-gmail providers.
        return res.status(httpCodes.OK).json({});
    }
    const outbox = await getOutbox();
    // check if there is a message in the outbox to this address
    // if there is a sequenced email in the outbox to this address, cancel it and update the sequence step
    if (outbox.messages.some((message) => message.envelope.to.includes(event.data.from.address))) {
        await deleteScheduledEmailIfReplied(event);
        const sequenceStep = await getSequenceEmailByMessageId(event.data.messageId);
        const update: SequenceEmailUpdate = { id: sequenceStep.id, email_delivery_status: 'Replied' };
        await updateSequenceEmail(update);
        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update } as any,
            message: `new reply from: ${event.data.from.address}`,
        });
    } else {
        await supabaseLogger({
            type: 'email-webhook',
            data: event as any,
            message: `newMessage from: ${event.data.from.address}`,
        });
    }

    return res.status(httpCodes.OK).json({});
};

const handleTrackClick = async (event: WebhookTrackClick, res: NextApiResponse) => {
    const sequenceStep = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = { id: sequenceStep.id, email_tracking_status: 'Link Clicked' };
    await updateSequenceEmail(update);
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
    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `trackOpen messageId: ${event.data.messageId}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleBounce = async (event: WebhookMessageBounce, res: NextApiResponse) => {
    const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId);
    const update: SequenceEmailUpdate = {
        id: sequenceEmail.id,
        email_delivery_status: 'Bounced',
    };
    await updateSequenceEmail(update);
    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `bounce messageId: ${event.data.messageId}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleComplaint = async (event: WebhookMessageComplaint, res: NextApiResponse) => {
    await supabaseLogger({
        type: 'email-webhook',
        data: event as any,
        message: `complaint complaintMessage: ${event.data.complaintMessage}`,
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
    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `deliveryError error: ${event.data.error}`,
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
    await supabaseLogger({
        type: 'email-webhook',
        data: { event, update } as any,
        message: `failed error: ${event.data.error}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleSent = async (event: WebhookMessageSent, res: NextApiResponse) => {
    try {
        const sequenceEmail = await getSequenceEmailByMessageId(event.data.messageId); // if there is no matching sequenceEmail, this is a regular email, not a sequenced email and this will throw an error
        const update: SequenceEmailUpdate = {
            id: sequenceEmail.id,
            email_delivery_status: 'Delivered',
        };
        await updateSequenceEmail(update);

        const sequenceInfluencer = await getSequenceInfluencerById(sequenceEmail.sequence_influencer_id);

        const sequenceInfluencerUpdate: SequenceInfluencerUpdate = {
            id: sequenceInfluencer.id,
            sequence_step: sequenceInfluencer.sequence_step + 1,
        };
        await updateSequenceInfluencer(sequenceInfluencerUpdate);

        await supabaseLogger({
            type: 'email-webhook',
            data: { event, update, sequenceInfluencerUpdate } as any,
            message: `sent to: ${event.data.envelope.to}`,
        });
        return res.status(httpCodes.OK).json({});
    } catch (error: any) {
        await supabaseLogger({
            type: 'email-webhook',
            data: { event, error } as any,
            message: `error sending to: ${event.data.envelope.to}. error: ${error?.message}`,
        });
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

const handleOtherWebhook = async (event: WebhookEvent, res: NextApiResponse) => {
    await supabaseLogger({ type: 'email-webhook', data: event as any, message: `otherWebhook event: ${event.event}` });
    return res.status(httpCodes.OK).json({});
};

export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req, res) => {
    // TODO: use a signing secret from the email client to authenticate the request
    const body = req.body as WebhookEvent;
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
