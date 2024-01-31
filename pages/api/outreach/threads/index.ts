import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { nreq } from 'src/utils/endpoints';
import type { GetThreadsApiResponse } from 'src/utils/endpoints/get-threads';
import { GetThreadsApiRequest } from 'src/utils/endpoints/get-threads';
import { getThreads } from 'src/utils/outreach/get-threads';

const postHandler: ActionHandler<GetThreadsApiResponse> = async (req, res) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get email account');
    }

    const request = GetThreadsApiRequest.safeParse(nreq(req));

    if (!request.success) {
        return res.status(400).json({
            error: request.error.format(),
        });
    }

    const account = req.profile.email_engine_account_id;
    const filters = request.data.body;

    const { data, totals, totalFiltered } = await getThreads({
        account,
        filters,
    });
    return res.status(200).json({ data, totals, totalFiltered });
};

export default ApiHandler({
    postHandler,
});
