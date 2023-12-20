import { eq } from 'drizzle-orm';
import { type emails, profiles } from 'drizzle/schema';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { getEmails } from 'src/utils/outreach/db/get-emails';
import type { Data as EmailData } from 'types/email-engine/webhook-message-new';

const transformEmails = (mails: (typeof emails.$inferSelect)[]) => {
    return mails.map((mail) => {
        const { date, unseen, id, from, to, cc, replyTo, text } = mail.data as EmailData;
        return {
            date,
            unread: unseen || false,
            id,
            from,
            to,
            cc: cc || [],
            replyTo,
            body: text.html,
        };
    });
};

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

    return res.status(200).json(transformEmails(emails));
};

export default ApiHandler({
    getHandler: getHandler,
});
