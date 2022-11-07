import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'src/utils/api/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { term, platform } = JSON.parse(req.body);

        console.log('lookalike', { term, platform, headers });

        const results = await (
            await fetch(
                `https://iqdata.social/v2.0/api/dict/users/?q=${term}&type=lookalike&platform=${platform}&limit=5`,
                {
                    headers
                }
            )
        ).json();

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
