import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            // will need these for usage tracking if we reenable that
            // company_id, user_id,
            ...searchParams
        } = JSON.parse(req.body);

        const results = await fetchCreatorsFiltered(searchParams);

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
