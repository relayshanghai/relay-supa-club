import type { FilterType } from 'src/components/inbox/wip/filter';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getThreadsWithReplyByFilter } from 'src/utils/outreach/db/get-threads-with-reply';
import { transformThreads } from 'src/utils/outreach/utils';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.profile || !req.profile.emailEngineAccountId) {
        throw new Error('Cannot get email account');
    }

    const filters = req.body as FilterType;

    const threads = await getThreadsWithReplyByFilter()(req.profile.emailEngineAccountId, filters);

    return res.status(200).json(transformThreads(threads));
};

export default ApiHandler({
    postHandler,
});
