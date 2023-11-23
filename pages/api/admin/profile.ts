import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import type { ProfileDB } from 'src/utils/api/db';
import { supabase } from 'src/utils/supabase-client';

export type AdminGetProfileGetQueries = {
    email: string;
};
export type AdminGetProfileGetResponse = ProfileDB;

export type AdminGetProfilePutBody = ProfileDB;

export type AdminGetProfilePutResponse = ProfileDB;

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.query as AdminGetProfileGetQueries;
    if (!body.email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .limit(1)
        .eq('email', body.email)
        .single();
    if (!profile || profileError) {
        return res.status(500).json({ message: JSON.stringify(profileError) });
    }
    const returnObject: AdminGetProfileGetResponse = profile;
    return res.status(200).json(returnObject);
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as AdminGetProfilePutBody;
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
    const returnObject: AdminGetProfilePutResponse = profile;
    return res.status(200).json(returnObject);
}

export default ApiHandler({
    getHandler,
    putHandler,
});
