/* eslint-disable no-console */
import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { supabaseLogger } from 'src/utils/api/db';

import type { SendEmailRequestBody, SendEmailResponseBody } from 'types/email-engine/account-account-submit-post';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';
import type { WebhookTrackClick } from 'types/email-engine/webhook-track-click';
import type { WebhookTrackOpen } from 'types/email-engine/webhook-track-open';

export type SendEmailPostRequestBody = SendEmailRequestBody & {
    account: string;
};

export type WebhookEvent = WebhookMessageNew | WebhookTrackClick | WebhookTrackOpen;

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
        default:
            break;
    }

    return res.status(httpCodes.OK).json({ body });
};

export default ApiHandler({ postHandler });
