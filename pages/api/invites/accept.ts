import type { User } from '@supabase/supabase-js';
import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { acceptInviteErrors } from 'src/errors/company';
import { inviteStatusErrors, loginValidationErrors } from 'src/errors/login';
import type { InviteStatusError } from 'src/errors/login';
import { getInviteById, getInviteValidityData, insertProfile, markInviteUsed, updateUserRole } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';
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

const handlePost: NextApiHandler = async (req, res) => {
    try {
        const { token, password, firstName, lastName } = req.body as CompanyAcceptInvitePostBody;
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

        const invite = await getInviteById(token);

        if (!invite?.company_id) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: acceptInviteErrors.inviteInvalid,
            });
        }

        if (invite?.used || Date.now() >= new Date(invite.expire_at ?? '').getTime()) {
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
        });

        if (userError) {
            // supabase returns this error if the user already exists
            if (userError?.message === 'User already registered') {
                return res.status(httpCodes.BAD_REQUEST).json({ error: acceptInviteErrors.userAlreadyRegistered });
            }
            serverLogger(userError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        if (!user?.id) {
            throw new Error('User not found');
        }
        const profileBody = {
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            company_id: invite.company_id,
        };
        const { error: profileError } = await insertProfile(profileBody);
        if (profileError) {
            throw new Error(profileError.message);
        }

        const { error: updateRoleError } = await updateUserRole(
            user.id,
            invite.company_owner ? 'company_owner' : 'company_teammate',
        );

        if (updateRoleError) {
            throw new Error(updateRoleError.message);
        }

        await markInviteUsed(token);
        const returnData: CompanyAcceptInvitePostResponse = user;

        return res.status(httpCodes.OK).json(returnData);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};
const handleGet: NextApiHandler = async (req, res) => {
    try {
        const { token } = req.query as CompanyAcceptInviteGetQueries;
        if (!token) return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing token' });
        const { data, error } = await getInviteValidityData(token);
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
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
};
const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        return await handlePost(req, res);
    }
    if (req.method === 'GET') {
        return await handleGet(req, res);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
};

export default handler;
