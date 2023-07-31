import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIqDataTopicsWithContext as fetchIqDataTopics } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = req.body;

        const metadata = {
            systemCall: true,
            action: 'api:influencer-search/topics',
            functionName: 'fetchIqDataTopics',
        };
        const results = await fetchIqDataTopics({ req, res, metadata })(term, platform);
        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
