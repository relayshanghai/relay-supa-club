import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';
import { searchSubscription } from 'src/utils/api/subscription/search';
import { supabase } from 'src/utils/supabase-client';
import { UsagesDB } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, user_id, ...rest } = JSON.parse(req.body);

        const subscriptions = await searchSubscription({ company_id });
        const limit = subscriptions.data.length > 0 ? 100 : 10;

        const results = await fetchCreatorsFiltered({
            limit,
            ...rest
        });

        const { error } = await supabase.from<UsagesDB>('usages').insert([
            {
                company_id,
                user_id,
                type: 'search'
            }
        ]);
        if (error) {
            res.status(400).json(error);
        }

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
