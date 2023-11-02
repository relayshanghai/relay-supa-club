import type { NextApiHandler, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { logBrevoErrors } from 'src/utils/api/slack/handle-alerts';
import { serverLogger } from 'src/utils/logger-server';

export type BrevoEvent = {
    event: string;
    email: string;
    id: string;
    date: string;
    subject: string;
    tags: string[];
};

const deferred = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Deferred', body);
    serverLogger('Brevo Email Deferred', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email deferred',
    });
};

const softBounce = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Soft Bounce', body);
    serverLogger('Brevo Email Soft Bounced', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email soft_bounce',
    });
};

const hardBounce = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Hard Bounce', body);
    serverLogger('Brevo Email Hard Bounced', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email hard_bounce',
    });
};

const complaint = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Complaint', body);
    serverLogger('Brevo Email Complaint', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email complaint',
    });
};

const invalidEmail = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Invalid_email', body);
    serverLogger('Brevo Email Invalid', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email invalid_email',
    });
};

const blocked = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Blocked', body);
    serverLogger('Brevo Email Blocked', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email blocked',
    });
};

const error = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors('Error', body);
    serverLogger('Brevo Email Error', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email error',
    });
};

const handleOtherWebhook = async (body: BrevoEvent, res: NextApiResponse) => {
    logBrevoErrors(body.event, body);
    serverLogger('Brevo Email Other Webhook', (scope) => {
        return scope.setContext('Webhook Payload', body);
    });
    return res.status(httpCodes.OK).json({
        message: 'email other_webhook',
    });
};

const postHandler: NextApiHandler = async (req, res) => {
    const body = req.body as BrevoEvent;

    try {
        switch (body.event) {
            case 'deferred':
                return deferred(body, res);
            case 'soft_bounce':
                return softBounce(body, res);
            case 'hard_bounce':
                return hardBounce(body, res);
            case 'complaint':
                return complaint(body, res);
            case 'invalid_email':
                return invalidEmail(body, res);
            case 'blocked':
                return blocked(body, res);
            case 'error':
                return error(body, res);
            default:
                return handleOtherWebhook(body, res);
        }
    } catch (error: any) {
        serverLogger('Brevo Webhook Processing Error', (scope) => {
            return scope.setContext('Webhook Payload', body);
        });
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default ApiHandler({ postHandler });
