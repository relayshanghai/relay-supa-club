import type { FunnelStatus } from 'src/utils/api/db';
import type { ThreadMessage } from '../../Threads';
import { apiFetch } from 'src/utils/api/api-fetch';

export const sendReply = async (params: { replyBody: string; threadId: string }) => {
    const { content } = await apiFetch(`/api/outreach/threads/{threadId}/reply`, {
        path: { threadId: params.threadId },
        body: { content: params.replyBody },
    });
    return content;
};

export const searchMessages = async (_params: { searchTerm: string; account: string }): Promise<ThreadMessage[]> => {
    // update message as seen using backend
    return [];
};

export const filterMessages = async (_params: { funnelStatus: FunnelStatus; account: string }) => {
    // update message as seen using backend
};
