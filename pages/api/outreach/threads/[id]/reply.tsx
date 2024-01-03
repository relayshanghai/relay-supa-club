import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { replyThread } from 'src/utils/outreach/reply-thread';

type ApiRequestQuery = {
    id?: string;
};

type ApiRequestBody = {
    content?: string;
};

const postHandler: ActionHandler = async (req, res) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get email account');
    }

    const query: ApiRequestQuery = req.query;
    const body: ApiRequestBody = req.body;

    if (!query.id || !body.content) {
        throw new Error('Cannot send message');
    }

    const result = await replyThread({
        account: req.profile.email_engine_account_id,
        threadId: query.id,
        content: body.content,
    });

    return res.status(200).json(result);
};

export default ApiHandler({
    postHandler: postHandler,
});
