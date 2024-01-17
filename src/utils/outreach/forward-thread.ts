import { forwardEmail } from './forward-email';
import type { AttachmentFile, EmailContact } from './types';

type ForwardThreadParams = {
    account: string;
    messageId: string;
    content: string;
    to?: EmailContact[];
    cc?: EmailContact[];
    attachments?: AttachmentFile[] | null;
};

type ForwardThreadFn = (params: ForwardThreadParams) => Promise<any>;

export const forwardThread: ForwardThreadFn = async (params) => {
    const [_account, emailEngineId] = params.messageId.split(':');

    return await forwardEmail({
        account: params.account,
        emailEngineId: emailEngineId,
        content: params.content,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
    });
};
