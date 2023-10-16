import type { SendEmailPostResponseBody } from 'pages/api/email-engine/send-email';
import { sendEmail as sendEmailCall } from '.';
import type { SendEmailRequestBody } from 'types/email-engine/account-account-submit-post';
import { serverLogger } from 'src/utils/logger-server';

export const sendTemplateEmail = async (
    account: string,
    toEmail: string,
    template: string,
    sendAt: string,
    params: Record<string, string>,
): Promise<{ error: string } | SendEmailPostResponseBody> => {
    const body: SendEmailRequestBody = {
        to: [{ address: toEmail }],
        template,
        render: {
            format: 'html',
            params,
        },
        trackingEnabled: true,
        sendAt,
    };

    try {
        return await sendEmailCall(body, account);
    } catch (error: any) {
        serverLogger(error, (scope) => {
            return scope.setContext('send_email_request_body', { body }).setTag('log_tag', 'sendTemplateEmail');
        });
        return { error: error.message };
    }
};
