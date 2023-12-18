import type { FunnelStatus } from 'src/utils/api/db';
import type { ThreadMessage } from '../../Threads';

export const sendReply = async (_params: { replyBody: string; account: string }) => {
    // send reply using backend
};

export const searchMessages = async (_params: { searchTerm: string; account: string }): Promise<ThreadMessage[]> => {
    // update message as seen using backend
    return [];
};

export const filterMessages = async (_params: { funnelStatus: FunnelStatus; account: string }) => {
    // update message as seen using backend
};
