import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { forwardThread } from 'src/utils/outreach/forward-thread';
import type { AttachmentFile, EmailContact } from 'src/utils/outreach/types';

export type ForwardRequestBody = {
    messageId: string;
    content: string;
    to: EmailContact[];
    cc: EmailContact[];
    attachments: AttachmentFile[];
};

type ApiRequestBody = ForwardRequestBody;

const postHandler: ActionHandler = async (req, res) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get email account');
    }

    const body: ApiRequestBody = req.body;
    if (!body.messageId) {
        throw new Error('Cannot send message');
    }

    const result = await forwardThread({
        account: req.profile.email_engine_account_id,
        messageId: body.messageId,
        content: body.content,
        to: (body.to ?? []).map((contact) => {
            return { name: contact.name, address: contact.address };
        }),
        cc: (body.cc ?? []).map((contact) => {
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
