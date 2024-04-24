import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import type { ProfileDB } from 'src/utils/api/db';
import { supabase } from 'src/utils/supabase-client';

export type AdminGetProfileQueries = {
    email: string;
};
export type AdminGetProfileResponse = ProfileDB[];

export type AdminPutProfileBody = ProfileDB;

export type AdminPutProfileResponse = ProfileDB;

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.query as AdminGetProfileQueries;
    if (!body.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    let query = supabase
        .from('profiles')
        .select('*,company:companies!inner(*)')
        .order('created_at', { ascending: true });

    if (body.email.includes('@')) query = query.eq('email', body.email);
    else query = query.eq('company.cus_id', body.email);
    const { data: profile, error: profileError } = await query;
    if (!profile || profileError) {
        return res.status(500).json({ message: JSON.stringify(profileError) });
    }
    return res.status(200).json(profile);
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as AdminPutProfileBody;
    if (!body.id) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const { id, email_engine_account_id, sequence_send_email } = body;
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({ email_engine_account_id, sequence_send_email })
        .eq('id', id)
        .select('*')
        .single();

    if (!profile || profileError) {
        return res.status(500).json({ message: JSON.stringify(profileError) });
    }
    // also update the service account
    if (!profile.email?.includes('support+cus_id')) {
        const { data: companyProfiles } = await supabase
            .from('profiles')
            .select('*, company:companies!inner(*)')
            .eq('company_id', profile.company_id)
            .neq('email', profile.email);
        const serviceAccount = companyProfiles?.find((p) => p.email?.includes('support+cus_id'));
        if (serviceAccount) {
            await supabase
                .from('profiles')
                .update({ id: serviceAccount.id, email_engine_account_id, sequence_send_email });
        }
    }
    return res.status(200).json(profile);
}

export default ApiHandler({
    getHandler,
    putHandler,
});
