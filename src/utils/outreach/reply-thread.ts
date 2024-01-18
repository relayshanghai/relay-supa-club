import { getThread } from './db/get-thread';
import { replyEmail } from './reply-email';
import type { AttachmentFile, EmailContact } from './types';

type ReplyThreadParams = {
    account: string;
    threadId: string;
    content: string;
    to?: EmailContact[];
    cc?: EmailContact[];
    attachments?: AttachmentFile[] | null;
};

type ReplyThreadFn = (params: ReplyThreadParams) => Promise<any>;

export const replyThread: ReplyThreadFn = async (params) => {
    const thread = await getThread()(params.threadId);

    if (!thread || !thread.thread.last_reply_id) {
        return false;
    }

    const [_account, last_reply_id] = thread.thread.last_reply_id.split(':');

    return await replyEmail({
        account: params.account,
        // last_reply_id can be null
        emailEngineId: last_reply_id || _account,
        content: params.content,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
    });
};
