import { type ActionHandler, ApiHandler } from 'src/utils/api-handler';
import { searchMessages } from 'src/utils/outreach/email-engine/search-messages';
import type { AccountAccountSearchPost } from 'types/email-engine/account-account-search-post';

const transformSearchResult = (result: AccountAccountSearchPost) => {
    const { messages } = result;

    const transformedMessages: { [key: string]: string[] } = messages.reduce((acc, message) => {
        const { threadId, id } = message;

        if (acc[threadId]) {
            acc[threadId].push(id);
        } else {
            acc[threadId] = [id];
        }

        return acc;
    }, {} as { [key: string]: string[] });

    return transformedMessages;
};

const getHandler: ActionHandler = async (req, res) => {
    const { searchTerm } = req.query;
    const emailEngineAccountId = req.profile?.email_engine_account_id;
    if (!emailEngineAccountId) {
        return res.status(400).json({ error: 'Missing email engine id' });
    }

    const body = {
        documentQuery: {
            query_string: {
                query: searchTerm,
            },
        },
    };
    const result = await searchMessages(emailEngineAccountId, body);

    return res.status(200).json(transformSearchResult(result));
};

export default ApiHandler({
    getHandler: getHandler,
});
