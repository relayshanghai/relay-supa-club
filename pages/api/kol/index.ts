import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';
import { searchSubscription } from 'src/utils/api/subscription/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, ...rest } = JSON.parse(req.body);

        const subscriptions = await searchSubscription({ company_id });
        const limit = subscriptions.data.length > 0 ? 100 : 10;

        const results = await fetchCreatorsFiltered({
            limit,
            ...rest
        });

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
