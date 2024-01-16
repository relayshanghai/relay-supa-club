import type { NextApiResponse } from 'next';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { DownloadAttachmentApiRequest } from 'src/utils/endpoints/download-attachment';
import { downloadAttachment } from 'src/utils/outreach/email-engine/download-attachment';

const getHandler: ActionHandler = async (req, res: NextApiResponse) => {
    if (!req.profile || !req.profile.email_engine_account_id) {
        throw new Error('Cannot get email account');
    }

    const request = DownloadAttachmentApiRequest.safeParse(req);

    if (!request.success) {
        return res.status(404).json({ error: 'Attachment not found' });
    }

    const attachment = await downloadAttachment(req.profile.email_engine_account_id, request.data.query.id);

    res.setHeader('Content-Disposition', `attachment;filename=${request.data.query.filename}`);

    // @note this may need to stream the content for larger stuff
    return res.status(200).end(attachment);
};

export default ApiHandler({
    getHandler,
});
