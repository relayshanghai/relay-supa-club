import type { NextApiRequest, NextApiResponse } from 'next';
import { serverLogger } from 'src/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(500).json({ message: 'Server error' });
    serverLogger('server logger error', 'error');
}
