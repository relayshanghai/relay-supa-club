import { NextApiRequest, NextApiResponse } from 'next';

import { fetchIqDataGeos } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term } = JSON.parse(req.body);

        const results = await fetchIqDataGeos(term);

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
