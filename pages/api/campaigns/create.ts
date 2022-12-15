import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, name, ...data } = JSON.parse(req.body);
        console.log({ company_id, name, ...data });
        // TODO: move all supabase calls like these to a separate file/folder
        const { data: campaign, error } = await supabase
            .from('campaigns')
            .insert({
                company_id: company_id,
                name: name,
                ...data,
                status: 'not started',
                slug: name.toLowerCase().replace(/ /g, '-')
            })
            .eq('company_id', company_id)
            .single();

        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaign);
    }

    return res.status(400).json(null);
}
