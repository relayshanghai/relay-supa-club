import { User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { acceptInviteErrors } from 'src/errors/company';
import { InviteStatusError, inviteStatusErrors, loginValidationErrors } from 'src/errors/login';
import { updateUserRole } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';
import { validatePassword } from 'src/utils/validation/signup';

export type CompanyAcceptInvitePostBody = {
    token: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
};
export type CompanyAcceptInvitePostResponse = User;

export type CompanyAcceptInviteGetQueries = {
    token: string;
};
export type CompanyAcceptInviteGetResponse = {
    message: InviteStatusError;
    email?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token, password, firstName, lastName } = (
            req.body,
        ) as CompanyAcceptInvitePostBody;
        if (!token || !password || !firstName || !lastName) {
            return res.status(httpCodes.BAD_REQUEST).json({
                error: loginValidationErrors.missingRequiredFields,
            });
        }
        const passwordInvalid = validatePassword(password);
        if (passwordInvalid) {
            return res.status(httpCodes.BAD_REQUEST).json({
                error: passwordInvalid,
            });
        }

        const { data: invite, error } = await supabase
            .from('invites')
            .select('*')
            .eq('id', token)
            .limit(1)
            .single();

        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        if (invite?.used || Date.now() >= new Date(invite.expire_at ?? '').getTime()) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: acceptInviteErrors.inviteInvalid,
            });
        }
        if (!invite?.company_id) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: acceptInviteErrors.inviteInvalid,
            });
        }

        // Sign-up the user with the given credentials
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.signUp({
            email: invite.email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName, company_id: invite.company_id },
            },
        });

        if (userError) {
            if (userError?.message === 'User already registered') {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: acceptInviteErrors.userAlreadyRegistered });
            }
            serverLogger(userError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        if (!user) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const { error: updateRoleError } = await updateUserRole(
            user.id,
            invite.company_owner ? 'company_owner' : 'company_teammate',
        );

        if (updateRoleError) {
            serverLogger(updateRoleError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        // Mark the invite as used
        const { error: updateError } = await supabase
            .from('invites')
            .update({
                used: true,
            })
            .eq('id', token)
            .single();

        if (updateError) {
            serverLogger(updateError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const returnData: CompanyAcceptInvitePostResponse = user;

        return res.status(httpCodes.OK).json(returnData);
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
                const response: { error: InviteStatusError } = {
                    error: inviteStatusErrors.inviteInvalid,
                };
                return res.status(httpCodes.UNAUTHORIZED).json(response);
            }
            if (data?.used) {
                const response: { error: InviteStatusError } = {
                    error: inviteStatusErrors.inviteUsed,
                };
                return res.status(httpCodes.UNAUTHORIZED).json(response);
            }
            if (Date.now() >= new Date(data.expire_at ?? '').getTime()) {
                const response: { error: InviteStatusError } = {
                    error: inviteStatusErrors.inviteExpired,
                };
                return res.status(httpCodes.UNAUTHORIZED).json(response);
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
