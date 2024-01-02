import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import type { GetThreadsApiResponse } from 'src/utils/endpoints/get-threads';
import { GetThreadsApiRequest } from 'src/utils/endpoints/get-threads';
import { getThreads } from 'src/utils/outreach/get-threads';

const postHandler: ActionHandler<GetThreadsApiResponse> = async (req, res) => {
    if (!req.profile || !req.profile.emailEngineAccountId) {
        throw new Error('Cannot get email account');
    }

    const request = GetThreadsApiRequest.safeParse(req);

    if (!request.success) {
        return res.status(400).json({
            error: request.error.format(),
        });
    }

    const { data, totals } = await getThreads({
        account: req.profile.emailEngineAccountId,
        filters: request.data.body,
    });

    return res.status(200).json({ data, totals });
};

export default ApiHandler({
    postHandler,
});
