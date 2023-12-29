import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import type { ApiResponse as UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { ApiRequest as UpdateThreadApiRequest } from 'src/utils/endpoints/update-thread';
import { getEmails } from 'src/utils/outreach/get-emails';
import { updateThread } from 'src/utils/outreach/update-thread';

type ApiRequest = {
    id?: string;
};

const getHandler: ActionHandler = async (req, res) => {
    if (!req.profile) {
        throw new Error('Cannot get user profile');
    }

    const query: ApiRequest = req.query;

    if (!query.id) {
        throw new Error('Cannot get emails');
    }

    const emails = await getEmails(query.id);

    return res.status(200).json(emails);
};

const postHandler: ActionHandler<UpdateThreadApiResponse> = async (req, res) => {
    if (!req.profile) {
        throw new Error('Cannot get user profile');
    }

    const parsed = UpdateThreadApiRequest.safeParse(req);

    if (!parsed.success) {
        return res.status(400).json({
            error: parsed.error.format(),
        });
    }

    const thread = await updateThread({
        threadId: parsed.data.query.id,
        data: parsed.data.body,
    });

    return res.status(200).json({ data: thread });
};

export default ApiHandler({
    getHandler: getHandler,
    postHandler,
});
