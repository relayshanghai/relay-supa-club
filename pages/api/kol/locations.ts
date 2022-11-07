import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'src/utils/api/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term } = JSON.parse(req.body);

        const results = await (
            await fetch(`https://iqdata.social/v2.0/api/geos/?q=${term}&count_type=search`, {
                headers
            })
        ).json();

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
