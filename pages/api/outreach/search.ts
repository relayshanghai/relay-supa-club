import { type ActionHandler, ApiHandler } from 'src/utils/api-handler';
import { searchMailbox } from 'src/utils/api/email-engine';
import { MAILBOX_PATH_ALL } from 'src/utils/outreach/constants';
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
    const emailEngineId = req.profile?.email_engine_account_id;
    if (!emailEngineId) {
        return res.status(400).json({ error: 'Missing email engine id' });
    }
    const result: AccountAccountSearchPost = await searchMailbox(
        emailEngineId,
        {
            body: String(searchTerm),
        },
        MAILBOX_PATH_ALL,
    );

    return res.status(200).json(transformSearchResult(result));
};

export default ApiHandler({
    getHandler: getHandler,
});
