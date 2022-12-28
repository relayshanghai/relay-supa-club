import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;
        const { data, error } = await supabase
            .from('campaigns')
            .select('*, companies(id, name, cus_id), campaign_creators(id)')
            .eq('company_id', companyId);
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(data);
    }
    return res.status(400).end();
}
