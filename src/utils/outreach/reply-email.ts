import type { SendEmailPostRequestBody } from 'pages/api/email-engine/webhook';
import { sendEmail } from '../api/email-engine';
import type { EmailContact } from './types';

type ReplyEmailParams = {
    account: string;
    emailEngineId: string;
    content: string;
    to?: EmailContact[];
    cc?: EmailContact[];
};

type ReplyEmailFn = (params: ReplyEmailParams) => Promise<any>;

export const replyEmail: ReplyEmailFn = async (params) => {
    const payload = {
        reference: {
            message: params.emailEngineId,
            inline: true,
            action: 'reply',
            documentStore: true,
        },
        html: params.content,
        to: params.to,
        cc: params.cc,
    } as SendEmailPostRequestBody; // @todo coerce types for now

    return await sendEmail(payload, params.account);
};
