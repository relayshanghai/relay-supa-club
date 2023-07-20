import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (_req, res) => {
    return res.status(200).json({ message: 'pong' });
};

export default handler;
