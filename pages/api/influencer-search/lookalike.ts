import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIqDataLookalikeByAudience, fetchIqDataLookalikeByInfluencer } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = req.body;
        const resultsByAudience = await fetchIqDataLookalikeByAudience(term, platform);
        const resultsByInfluencer = await fetchIqDataLookalikeByInfluencer(term, platform);

        const mergedResults = [...resultsByAudience.data, ...resultsByInfluencer.data];
        // Remove duplicates
        const results = mergedResults.filter((result, index) => {
            return mergedResults.findIndex((r) => r.user_id === result.user_id) === index;
        });

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
