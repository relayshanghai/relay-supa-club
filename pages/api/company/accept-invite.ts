import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token, password, firstName, lastName } = JSON.parse(req.body);
        const { data, error } = await supabase
            .from('invites')
            .select('*')
            .eq('id', token)
            .limit(1)
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        if (data.used || Date.now() > new Date(data.expire_at).getTime()) {
            return res.status(500).json({
                error: true,
                expired: true
            });
        }

        // Sign-up the user with the given credentials
        const { error: userError } = await supabase.auth.signUp(
            {
                email: data.email,
                password
            },
            {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    company_id: data.company_id
                }
            }
        );

        if (userError) {
            return res.status(500).json({ error: userError });
        }

        // Mark the invite as used
        const { data: invite, error: err } = await supabase
            .from('invites')
            .update({
                used: true
            })
            .eq('id', token)
            .single();

        if (err) {
            return res.status(500).json({ error: err });
        }

        return res.status(200).json({ data, invite });
    }

    return res.status(400).json(null);
}
