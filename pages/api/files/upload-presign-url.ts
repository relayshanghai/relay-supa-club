import type { NextApiHandler } from 'next';
import StorageService from 'src/backend/domain/storage/storage';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

const getHandler: NextApiHandler = async (req, res) => {
    const { filename } = req.query;
    const presignUrl = await StorageService.getService().createUploadSignUrl(filename as string);
    res.send({ url: presignUrl });
};

export default ApiHandlerWithContext({ getHandler, requireAuth: true });
