import type { NextApiRequest, NextApiResponse } from 'next';
import { serverLogger } from 'src/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    serverLogger('server logger error', 'error');
    serverLogger('server logger info', 'info');
    serverLogger('server logger warning', 'warning');
    res.status(500).json({ message: 'Server error' });
}
