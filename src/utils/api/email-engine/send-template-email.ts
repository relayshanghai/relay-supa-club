import type { SendEmailPostResponseBody } from 'pages/api/email-engine/send-email';
import { clientLogger } from 'src/utils/logger-client';
import { sendEmail as sendEmailCall } from '.';
import type { SendEmailRequestBody } from 'types/email-engine/account-account-submit-post';

export const sendTemplateEmail = async (
    account: string,
    toEmail: string,
    template: string,
    sendAt: string,
    params: Record<string, string>,
): Promise<{ error: string } | SendEmailPostResponseBody> => {
    try {
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
        return await sendEmailCall(body, account);
    } catch (error: any) {
        clientLogger(error, 'error');
        return { error: error.message };
    }
};
