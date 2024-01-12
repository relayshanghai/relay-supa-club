import type { SendEmailPostRequestBody } from 'pages/api/email-engine/webhook';
import { sendEmail } from '../api/email-engine';
import type { AttachmentFile, EmailContact } from './types';

type ForwardEmailParams = {
    account: string;
    emailEngineId: string;
    content: string;
    to?: EmailContact[];
    cc?: EmailContact[];
    attachments?: AttachmentFile[] | null;
};

type ForwardEmailFn = (params: ForwardEmailParams) => Promise<any>;

export const forwardEmail: ForwardEmailFn = async (params) => {
    const payload = {
        reference: {
            message: params.emailEngineId,
            inline: true,
            action: 'forward',
            documentStore: true,
            forwardAttachments: true,
        },
        html: params.content,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
    } as SendEmailPostRequestBody; // @todo coerce types for now

    return await sendEmail(payload, params.account);
};
