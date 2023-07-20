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

const handleNewEmail = (event: WebhookMessageNew, res: NextApiResponse) => {
    console.log({ WebhookMessageNew: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};
const handleTrackClick = (event: WebhookTrackClick, res: NextApiResponse) => {
    console.log({ WebhookTrackClick: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleTrackOpen = (event: WebhookTrackOpen, res: NextApiResponse) => {
    console.log({ WebhookTrackOpen: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleBounce = (event: WebhookMessageBounce, res: NextApiResponse) => {
    console.log({ WebhookMessageBounce: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleComplaint = (event: WebhookMessageComplaint, res: NextApiResponse) => {
    console.log({ WebhookMessageComplaint: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleDeliveryError = (event: WebhookMessageDeliveryError, res: NextApiResponse) => {
    console.log({ WebhookMessageDeliveryError: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleFailed = (event: WebhookMessageFailed, res: NextApiResponse) => {
    console.log({ WebhookMessageFailed: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
    return res.status(httpCodes.OK).json({});
};

const handleSent = (event: WebhookMessageSent, res: NextApiResponse) => {
    console.log({ WebhookMessageSent: event });
    supabaseLogger({ type: 'email-webhook', data: event as any });
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
            break;
    }

    return res.status(httpCodes.OK).json({ body });
};

export default ApiHandler({ postHandler });
