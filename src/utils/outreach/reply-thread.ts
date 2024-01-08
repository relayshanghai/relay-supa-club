import { getThread } from './db/get-thread';
import { replyEmail } from './reply-email';
import type { EmailContact } from './types';

type ReplyThreadParams = {
    account: string;
    threadId: string;
    content: string;
    to?: EmailContact[];
    cc?: EmailContact[];
};

type ReplyThreadFn = (params: ReplyThreadParams) => Promise<any>;

export const replyThread: ReplyThreadFn = async (params) => {
    const thread = await getThread()(params.threadId);

    if (!thread || !thread.thread.last_reply_id) {
        return false;
    }

    return await replyEmail({
        account: params.account,
        emailEngineId: thread.thread.last_reply_id,
        content: params.content,
        to: params.to,
        cc: params.cc,
    });
};
