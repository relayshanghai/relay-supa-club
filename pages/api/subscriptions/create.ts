import { NextApiRequest, NextApiResponse } from 'next';
import { createSubscription } from 'src/utils/api/create-subscription';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, plan_id } = JSON.parse(req.body);

        try {
            const data = await createSubscription({
                company_id,
                plan_id
            });

            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    return res.status(400).json(null);
}
