import { NextApiRequest, NextApiResponse } from 'next';
import { createSubscription } from 'src/utils/api/create-subscription';
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
            .single();

        if (profileError) {
            return res.status(500).json(profileError);
        }

        const { data: plan, error: plansError } = await supabase
            .from('plans')
            .select('id')
            .eq('has_trial', true)
            .single();

        if (plansError) {
            return res.status(500).json(profileError);
        }

        try {
            await createSubscription({
                company_id: company.id,
                plan_id: plan.id
            });
        } catch (e) {
            return res.status(500).json(e);
        }

        return res.status(200).json({ profile, company });
    }

    return res.status(400).json(null);
}
