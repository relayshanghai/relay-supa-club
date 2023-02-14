import { NextApiRequest, NextApiResponse } from 'next';

import { fetchIqDataGeos } from 'src/utils/api/iqdata';
import { chinaFilter } from 'src/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term } = JSON.parse(req.body);

        const results = await fetchIqDataGeos(term);

        // Filter out Taiwan and Hong Kong in the location results from iqData and replace with China (Taiwan) and China (Hong Kong)
        const filteredResults = results.map((result: { title: string; name: string }) => {
            if (
                result.title.toLowerCase().includes('taiwan') ||
                result.title.toLowerCase().includes('hongkong')
            ) {
                return {
                    ...result,
                    title: chinaFilter(result.title),
                };
            }
            return result;
        });

        return res.status(200).json(filteredResults);
    }

    return res.status(400).json(null);
}
