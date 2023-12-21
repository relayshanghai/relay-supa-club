import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { getEmails } from 'src/utils/outreach/db/get-emails';

type ApiRequest = {
    id?: string;
};

const getHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        throw new Error('Cannot get user profile');
    }

    const rows = await db().select().from(profiles).where(eq(profiles.id, req.session.user.id)).limit(1);

    if (rows.length !== 1) {
        throw new Error('Cannot get user profile');
    }

    const query: ApiRequest = req.query;

    if (!query.id) {
        throw new Error('Cannot get emails');
    }

    const emails = await getEmails()(query.id);

    return res.status(200).json({ emails });
};

export default ApiHandler({
    getHandler: getHandler,
});
