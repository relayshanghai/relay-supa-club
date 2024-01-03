import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import type { UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { UpdateThreadApiRequest } from 'src/utils/endpoints/update-thread';
import { serverLogger } from 'src/utils/logger-server';
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

    serverLogger('randi');

    const request = UpdateThreadApiRequest.safeParse(req);

    if (!request.success) {
        return res.status(400).json({
            error: request.error.format(),
        });
    }

    const thread = await updateThread({
        threadId: request.data.query.id,
        data: request.data.body,
    });

    return res.status(200).json({ data: request });
};

export default ApiHandler({
    getHandler: getHandler,
    postHandler,
});
