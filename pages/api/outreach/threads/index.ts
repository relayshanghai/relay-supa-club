import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { getThreads } from 'src/utils/outreach/db/get-threads';

const getHandler: ActionHandler = async (req, res) => {
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

    const threads = await getThreads()(profile.emailEngineAccountId);

    return res.status(200).json({ threads });
};

export default ApiHandler({
    getHandler: getHandler,
});
