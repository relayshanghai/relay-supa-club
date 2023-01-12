import { NextApiRequest, NextApiResponse } from 'next';
import { ensureCustomer } from 'src/utils/api/ensure-customer';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { user_id, name, website } = JSON.parse(req.body);
        const { data: company, error } = await supabase
            .from('companies')
            .insert({
                name,
                website
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .update({
                company_id: company.id,
                admin: true
            })
            .eq('id', user_id)
            .select()
            .single();

        if (profileError) {
            return res.status(500).json(profileError);
        }

        // Create the customer in stripe as well
        await ensureCustomer({ company_id: company.id, name });

        return res.status(200).json({ profile, company });
    }

    return res.status(400).json(null);
}
