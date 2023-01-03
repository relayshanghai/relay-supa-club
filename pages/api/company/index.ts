import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';
import { CompanyDB, CompanyWithProfilesInvitesAndUsage } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id as string;

        const { data, error } = await supabase
            .from<CompanyWithProfilesInvitesAndUsage>('companies')
            .select(
                // If this query changes, make sure to update the CompanyWithProfilesInvitesAndUsage type
                '*, profiles(id, first_name, last_name, admin), invites(id, email, used, expire_at), usages(id)'
            )
            .eq('id', companyId)
            //@ts-ignore
            .eq('invites.used', false)
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { id, ...rest } = JSON.parse(req.body);
        const { data, error } = await supabase
            .from<CompanyDB>('companies')
            .update({
                ...rest
            })
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json(error);
        }
        if (!data || !data.cus_id || !data.name || !data.website) {
            return res.status(500).json({ error: 'Missing data' });
        }

        await stripeClient.customers.update(data.cus_id, {
            name: data.name,
            description: data.website,
            metadata: {
                company_id: id
            }
        });

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
