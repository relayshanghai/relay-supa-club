import { NextApiRequest, NextApiResponse } from 'next';
import { fetchIqDataLookalike } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = JSON.parse(req.body);
        const results = await fetchIqDataLookalike(term, platform.platform);
        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
