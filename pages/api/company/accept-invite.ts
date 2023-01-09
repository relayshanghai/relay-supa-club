import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export type CompanyAcceptInvitePostBody = {
    token: string;
    password: string;
    firstName: string;
    lastName: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token, password, firstName, lastName } = JSON.parse(
            req.body
        ) as CompanyAcceptInvitePostBody;
        const { data, error } = await supabase
            .from('invites')
            .select('*')
            .eq('id', token)
            .limit(1)
            .single();

        if (error) {
            return res.status(500).json(error);
        }
        if (data?.used || Date.now() >= new Date(data.expire_at ?? '').getTime()) {
            return res.status(500).json({
                error: 'Invite is invalid or expired'
            });
        }

        // Sign-up the user with the given credentials
        const { error: userError } = await supabase.auth.signUp({
            email: data.email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    company_id: data.company_id
                }
            }
        });

        if (userError) {
            return res.status(500).json(userError);
        }

        // Mark the invite as used
        const { data: invite, error: updateError } = await supabase
            .from('invites')
            .update({
                used: true
            })
            .eq('id', token)
            .single();

        if (updateError) {
            return res.status(500).json(updateError);
        }

        return res.status(200).json({ data, invite });
    }
    if (req.method === 'GET') {
        const token = req.query.token as string;
        const { data, error } = await supabase
            .from('invites')
            .select('used, expire_at')
            .eq('id', token)
            .limit(1)
            .single();
        if (error) {
            return res.status(500).json({
                error: 'Invite is invalid or expired'
            });
        }
        if (data?.used) {
            return res.status(500).json({
                error: 'Invite already used'
            });
        }
        if (Date.now() >= new Date(data.expire_at ?? '').getTime()) {
            return res.status(500).json({
                error: 'Invite is expired'
            });
        }
        return res.status(200).json({ message: 'Invite is valid' });
    }

    return res.status(400).json(null);
}
