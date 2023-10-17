import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
    return res.status(500).end();
};

export default handler;
