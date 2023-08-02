import type { SendEmailPostRequestBody, SendEmailPostResponseBody } from 'pages/api/email-engine/send-email';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';

export const sendEmail = async (
    account: string,
    toEmail: string,
    template: string,
    sendAt: string,
    params: Record<string, string>,
): Promise<{ error: string } | SendEmailPostResponseBody> => {
    try {
        const body: SendEmailPostRequestBody = {
            account,
            to: [{ address: toEmail }],
            subject: 'testing Email Sequence',
            template,
            render: {
                format: 'html',
                params,
            },
            trackingEnabled: true,
            sendAt,
        };
        return await nextFetch<SendEmailPostResponseBody>('email-engine/send-email', {
            method: 'POST',
            body,
        });
    } catch (error: any) {
        clientLogger(error, 'error');
        return { error: error.message };
    }
};
