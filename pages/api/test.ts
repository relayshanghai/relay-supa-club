import type { NextApiHandler } from 'next';
import { ApiHandler } from 'src/utils/api-handler';

const getHandler: NextApiHandler = async (req, res) => {
    return res.status(200).json({ success: true });
};

export default ApiHandler({
    getHandler,
});
