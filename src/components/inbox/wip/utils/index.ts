import type { FunnelStatus } from 'src/utils/api/db';
import type { ThreadMessage } from '../../Threads';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { AttachmentFile, EmailContact } from 'src/utils/outreach/types';

export const sendReply = async (params: {
    replyBody: string;
    threadId: string;
    cc: EmailContact[];
    to: EmailContact[];
    attachments?: AttachmentFile[] | null;
}) => {
    const { content } = await apiFetch<any, any>(`/api/outreach/threads/{threadId}/reply`, {
        path: { threadId: params.threadId },
        body: { content: params.replyBody, cc: params.cc, to: params.to, attachments: params.attachments },
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
