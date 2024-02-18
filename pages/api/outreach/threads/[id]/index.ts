import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { nreq } from 'src/utils/endpoints';
import type { UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { UpdateThreadApiRequest } from 'src/utils/endpoints/update-thread';
import { getEmails } from 'src/utils/outreach/get-emails';
import { updateThread } from 'src/utils/outreach/update-thread';

const getHandler: ActionHandler = async (req, res) => {
    if (!req.profile) {
        throw new Error('Cannot get user profile');
    }

    const query: { id?: string } = req.query;

    if (!query.id) {
        throw new Error('Cannot get emails');
    }

    const emails = await getEmails(query.id);

    return res.status(200).json(emails);
};

const postHandler: ActionHandler<UpdateThreadApiResponse> = async (req, res) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get user profile');
    }

    const request = UpdateThreadApiRequest.safeParse(nreq(req));

    if (!request.success) {
        return res.status(400).json({
            error: request.error.format(),
        });
    }

    const thread = await updateThread({
        account: req.profile.email_engine_account_id,
        threadId: request.data.path.id,
        data: request.data.body,
    });

    return res.status(200).json({ data: thread });
};

export default ApiHandler({
    getHandler: getHandler,
    postHandler,
});
