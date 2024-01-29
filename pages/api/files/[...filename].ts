import type { NextApiHandler } from 'next';
import StorageService from 'src/backend/domain/storage/storage';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

const deleteHandler: NextApiHandler = async (req, res) => {
    const filename = req.query.filename as string[];
    await StorageService.getService().remove(filename.join('/'));
    res.status(httpCodes.NO_CONTENT);
};

export default ApiHandlerWithContext({ deleteHandler, requireAuth: true });
