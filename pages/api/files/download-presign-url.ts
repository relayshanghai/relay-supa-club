import type { NextApiHandler } from 'next';
import StorageService from 'src/backend/domain/storage/storage';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

const getHandler: NextApiHandler = async (req, res) => {
    const { path } = req.query;
    const signedUrl = await StorageService.getService().createDownloadSignUrl(path as string);
    res.redirect(signedUrl);
};

export default ApiHandlerWithContext({ getHandler, requireAuth: false });
