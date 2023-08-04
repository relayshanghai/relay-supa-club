import type { NextApiRequest, NextApiResponse } from 'next';

import { fetchIqDataGeosWithContext as fetchIqDataGeos } from 'src/utils/api/iqdata';
import { IQDATA_LIST_GEOLOCATIONS, rudderstack } from 'src/utils/rudderstack';
import { chinaFilter } from 'src/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term } = req.body;

        await rudderstack.identify({ req, res });

        rudderstack.track({
            event: IQDATA_LIST_GEOLOCATIONS,
            onTrack: () => {
                return {
                    term,
                };
            },
        });

        const results = await fetchIqDataGeos({ req, res })(term);

        // Filter out Taiwan and Hong Kong in the location results from iqData and replace with China (Taiwan) and China (Hong Kong)
        const filteredResults = results?.map((result: { title: string; name: string }) => {
            if (
                result.title.toLowerCase().includes('taiwan') ||
                result.title.toLowerCase().includes('hongkong' || 'hong kong') ||
                result.name.toLowerCase().includes('taiwan') ||
                result.name.toLowerCase().includes('hongkong' || 'hong kong')
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
