import type { NextApiHandler } from 'next';
import StorageService from 'src/backend/domain/storage/storage';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

const getHandler: NextApiHandler = async (req, res) => {
    const { path } = req.query;
    const files = await StorageService.getService().fileList(path as string);
    res.send({ files });
};

export default ApiHandlerWithContext({ getHandler, requireAuth: true });
