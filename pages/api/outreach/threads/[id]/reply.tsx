import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { db } from 'src/utils/database';
import { replyThread } from 'src/utils/outreach/reply-thread';

type ApiRequestQuery = {
    id?: string;
};

type ApiRequestBody = {
    content?: string;
};

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        throw new Error('Cannot get user profile');
    }

    const query: ApiRequestQuery = req.query;
    const body: ApiRequestBody = req.body;

    if (!query.id || !body.content) {
        throw new Error('Cannot send message');
    }

    const rows = await db().select().from(profiles).where(eq(profiles.id, req.session.user.id)).limit(1);

    if (rows.length !== 1) {
        throw new Error('Cannot get user profile');
    }

    const profile = rows[0];

    if (!profile.emailEngineAccountId) {
        throw new Error('Cannot get email account');
    }

    const result = await replyThread({
        account: profile.emailEngineAccountId,
        threadId: query.id,
        content: body.content,
    });

    return res.status(200).json([
        {
            date: '2023-12-22T07:03:57.000Z',
            unread: false,
            id: '123',
            from: {
                name: 'LMNAO',
                address: 'jiggling.potato@gmail.com',
            },
            to: [
                {
                    name: 'Suvojit Ghosh',
                    address: 'ghoshsuvojit2012@gmail.com',
                },
            ],
            cc: [],
            replyTo: [
                {
                    name: 'LMNAO',
                    address: 'jiggling.potato@gmail.com',
                },
            ],
            subject: 'Re: 3rd Follow-up',
            body: body.content,
        },
    ]);
};

export default ApiHandler({
    postHandler: postHandler,
});
