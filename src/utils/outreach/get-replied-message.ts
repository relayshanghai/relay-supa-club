import { getEmailByMessageId } from './db/get-email-by-message-id';
import { searchMessages } from './email-engine/search-messages';

export const getRepliedToMessage = async (account: string, messageId: string) => {
    const repliedMessage = await getEmailByMessageId()(messageId);

    if (repliedMessage) {
        return repliedMessage.email_engine_id;
    }

    const body = {
        documentQuery: {
            query_string: { query: messageId, fields: ['messageId'] },
        },
    };

    const result = await searchMessages(account, body);

    return result.total === 1 ? result.messages[0].id : null;
};
