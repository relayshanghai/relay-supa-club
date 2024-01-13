import type { AttachmentFile, EmailContact } from 'src/utils/outreach/types';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { replyThread } from 'src/utils/outreach/reply-thread';

type ApiRequestQuery = {
    id?: string;
};

type ApiRequestBody = {
    content?: string;
    cc?: EmailContact[];
    to?: EmailContact[];
    attachments?: AttachmentFile[] | null;
};

const postHandler: ActionHandler = async (req, res) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get email account');
    }

    const query: ApiRequestQuery = req.query;
    const body: ApiRequestBody = req.body;

    if (!query.id || !body.content || !body.to || !body.cc) {
        throw new Error('Cannot send message');
    }

    const result = await replyThread({
        account: req.profile.email_engine_account_id,
        threadId: query.id,
        content: body.content,
        to: body.to.map((contact) => {
            return { name: contact.name, address: contact.address };
        }),
        cc: body.cc.map((contact) => {
            return { name: contact.name, address: contact.address };
        }),
        attachments: (body.attachments ?? []).map((attachment) => {
            return { filename: attachment.filename, content: attachment.content };
        }),
    });

    return res.status(200).json(result);
};

export default ApiHandler({
    postHandler: postHandler,
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb',
        },
    },
};
