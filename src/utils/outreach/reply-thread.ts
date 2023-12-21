import { getThread } from './db/get-thread';
import { replyEmail } from './reply-email';

type ReplyThreadParams = {
    account: string;
    threadId: string;
    content: string;
};

type ReplyThreadFn = (params: ReplyThreadParams) => Promise<any>;

export const replyThread: ReplyThreadFn = async (params) => {
    const thread = await getThread()(params.threadId);

    if (!thread || !thread.thread.lastReplyId) {
        return false;
    }

    return await replyEmail({
        account: params.account,
        emailEngineId: thread.thread.lastReplyId,
        content: params.content,
    });
};
