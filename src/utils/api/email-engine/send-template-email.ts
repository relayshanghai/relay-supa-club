import type { SendEmailPostResponseBody } from 'pages/api/email-engine/send-email';
import { sendEmail as sendEmailCall } from '.';
import type { SendEmailRequestBody } from 'types/email-engine/account-account-submit-post';
import { serverLogger } from 'src/utils/logger-server';

export const sendTemplateEmail = async ({
    account,
    toEmail,
    template,
    params,
    sendAt,
    references,
    messageId,
}: {
    account: string;
    toEmail: { name: string; address: string };
    template: string;
    sendAt?: string;
    params: Record<string, string>;
    references?: string;
    messageId?: string;
}): Promise<{ error: string } | SendEmailPostResponseBody> => {
    const body: SendEmailRequestBody = {
        to: [toEmail],
        template,
        render: {
            format: 'html',
            params,
        },
        trackingEnabled: true,
        sendAt,
    };
    if (messageId) {
        body.messageId = messageId;
    }
    if (references) {
        // enables threading of outgoing emails
        // see https://docs.emailengine.app/sending-multiple-emails-in-the-same-thread/
        if (!body.headers) body.headers = {};
        body.headers.references = references;
    }

    try {
        return await sendEmailCall(body, account);
    } catch (error: any) {
        serverLogger(error, (scope) => {
            return scope.setContext('send_email_request_body', { body }).setTag('log_tag', 'sendTemplateEmail');
        });
        return { error: error.message };
    }
};
