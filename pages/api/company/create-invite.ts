import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, company_id } = JSON.parse(req.body);
        const { data, error } = await supabase
            .from('invites')
            .insert({
                email,
                company_id
            })
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        console.log(`/signup/invite?token=${data.id}`);

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
