import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';

export type CompanyAcceptInvitePostBody = {
    token: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type CompanyAcceptInviteGetQueries = {
    token: string;
};
export type CompanyAcceptInviteGetResponse = {
    message: 'inviteValid';
    email?: string;
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
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        if (data?.used || Date.now() >= new Date(data.expire_at ?? '').getTime()) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'inviteInvalid'
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
            serverLogger(userError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(userError);
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
            serverLogger(updateError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(updateError);
        }

        return res.status(httpCodes.OK).json({ data, invite });
    }
    if (req.method === 'GET') {
        try {
            const { token } = req.query as CompanyAcceptInviteGetQueries;
            if (!token) return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing token' });
            const { data, error } = await supabase
                .from('invites')
                .select('used, expire_at, email')
                .eq('id', token)
                .limit(1)
                .single();
            if (error) {
                serverLogger(error, 'error');
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'inviteInvalid'
                });
            }
            if (data?.used) {
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'inviteUsed'
                });
            }
            if (Date.now() >= new Date(data.expire_at ?? '').getTime()) {
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'inviteExpired'
                });
            }
            return res.status(httpCodes.OK).json({ message: 'inviteValid', email: data.email });
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Something went wrong' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
