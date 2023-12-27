import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { FilterType } from 'src/components/inbox/wip/filter';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { getThreadsWithReplyByFilter } from 'src/utils/outreach/db/get-threads-with-reply';
import { transformThreads } from 'src/utils/outreach/utils';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        throw new Error('Cannot get user profile');
    }

    const rows = await db().select().from(profiles).where(eq(profiles.id, req.session.user.id)).limit(1);

    if (rows.length !== 1) {
        throw new Error('Cannot get user profile');
    }

    const profile = rows[0];

    if (!profile.emailEngineAccountId) {
        throw new Error('Cannot get email account');
    }

    const filters = req.body as FilterType;

    const threads = await getThreadsWithReplyByFilter()(profile.emailEngineAccountId, filters);

    return res.status(200).json(transformThreads(threads));
};

export default ApiHandler({
    postHandler,
});
