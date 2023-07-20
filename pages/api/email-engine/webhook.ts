/* eslint-disable no-console */
import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { supabaseLogger } from 'src/utils/api/db';

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

const handleNewEmail = async (event: WebhookMessageNew, res: NextApiResponse) => {
    console.log({ WebhookMessageNew: event });
    await supabaseLogger({
        type: 'email-webhook',
        data: event as any,
        message: `newMessage from: ${event.data.from.address}`,
    });
    return res.status(httpCodes.OK).json({});
};
const handleTrackClick = async (event: WebhookTrackClick, res: NextApiResponse) => {
    console.log({ WebhookTrackClick: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any, message: `trackClick url: ${event.data.url}` });
    return res.status(httpCodes.OK).json({});
};

const handleTrackOpen = async (event: WebhookTrackOpen, res: NextApiResponse) => {
    console.log({ WebhookTrackOpen: event });
    await supabaseLogger({
        type: 'email-webhook',
        data: event as any,
        message: `trackOpen messageId: ${event.data.messageId}`,
    });
    return res.status(httpCodes.OK).json({});
};

const handleBounce = async (event: WebhookMessageBounce, res: NextApiResponse) => {
    console.log({ WebhookMessageBounce: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleComplaint = async (event: WebhookMessageComplaint, res: NextApiResponse) => {
    console.log({ WebhookMessageComplaint: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleDeliveryError = async (event: WebhookMessageDeliveryError, res: NextApiResponse) => {
    console.log({ WebhookMessageDeliveryError: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleFailed = async (event: WebhookMessageFailed, res: NextApiResponse) => {
    console.log({ WebhookMessageFailed: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleSent = async (event: WebhookMessageSent, res: NextApiResponse) => {
    console.log({ WebhookMessageSent: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleOtherWebhook = async (event: WebhookEvent, res: NextApiResponse) => {
    console.log({ UnknownWebhook: event });
    await supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

export type SendEmailPostResponseBody = SendEmailResponseBody;
const postHandler: NextApiHandler = async (req, res) => {
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
