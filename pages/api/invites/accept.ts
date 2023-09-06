/* eslint-disable complexity */
import type { User } from '@supabase/supabase-js';
import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { acceptInviteErrors } from 'src/errors/company';
import { inviteStatusErrors, loginValidationErrors } from 'src/errors/login';
import type { InviteStatusError } from 'src/errors/login';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
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
    phone?: string;
};
export type CompanyAcceptInvitePostResponse = User;

export type CompanyAcceptInviteGetQueries = {
    token: string;
};
export type CompanyAcceptInviteGetResponse = {
    message: InviteStatusError;
    email?: string;
};

const postHandler: NextApiHandler = async (req, res) => {
    const { token, password, firstName, lastName, phone } = req.body as CompanyAcceptInvitePostBody;
    if (!token || !password || !firstName || !lastName) {
        throw new RelayError(loginValidationErrors.missingRequiredFields, httpCodes.UNAUTHORIZED);
    }

    const passwordInvalid = validatePassword(password);
    if (passwordInvalid) {
        throw new RelayError('invalid password', httpCodes.UNAUTHORIZED);
    }

    const { data: invite } = await getInviteById(token);

    if (!invite?.company_id) {
        throw new RelayError(acceptInviteErrors.inviteInvalid, httpCodes.UNAUTHORIZED);
    }

    if (invite?.used || Date.now() >= new Date(invite.expire_at ?? '').getTime()) {
        throw new RelayError(acceptInviteErrors.inviteInvalid, httpCodes.UNAUTHORIZED);
    }

    // Sign-up the user with the given credentials
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.admin.createUser({
        email: invite.email,
        password,
        email_confirm: true,
    });

    if (userError) {
        // supabase returns this error if the user already exists
        if (userError?.message === 'User already registered') {
            throw new RelayError(acceptInviteErrors.userAlreadyRegistered, httpCodes.BAD_REQUEST);
        }
        serverLogger(userError);
        throw new RelayError('Signup failed', httpCodes.BAD_REQUEST);
    }
    if (!user?.id) {
        throw new RelayError('User not found', httpCodes.BAD_REQUEST);
    }

    try {
        const profileBody = {
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            company_id: invite.company_id,
            email: invite.email,
            phone,
        };
        const { data: profile, error: profileError } = await insertProfile(profileBody);

        if (profileError) {
            throw new RelayError(profileError.message, httpCodes.BAD_REQUEST);
        }
        if (!profile.email || profile.email !== invite.email) {
            throw new RelayError('Error creating profile', httpCodes.BAD_REQUEST);
        }

        const { error: updateRoleError } = await updateUserRole(
            user.id,
            invite.company_owner ? 'company_owner' : 'company_teammate',
        );

        if (updateRoleError) {
            throw new RelayError(updateRoleError.message, httpCodes.BAD_REQUEST);
        }

        await markInviteUsed(token);
        const returnData: CompanyAcceptInvitePostResponse = user;

        return res.status(httpCodes.OK).json(returnData);
    } catch (error: any) {
        // if any errors, delete the half-formed account
        const { error: profileDeleteError } = await supabase.from('profiles').delete().match({ id: user.id });
        const { data, error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
        serverLogger({ profileDeleteError, authDeleteError, data });
        throw new RelayError(error.message, httpCodes.BAD_REQUEST);
    }
};
const getHandler: NextApiHandler = async (req, res) => {
    const { token } = req.query as CompanyAcceptInviteGetQueries;
    if (!token) {
        throw new RelayError('Missing token', httpCodes.BAD_REQUEST);
    }
    const { data, error } = await getInviteValidityData(token);
    if (error) {
        serverLogger(error);
        throw new RelayError(inviteStatusErrors.inviteInvalid, httpCodes.UNAUTHORIZED);
    }
    if (data?.used) {
        throw new RelayError(inviteStatusErrors.inviteUsed, httpCodes.UNAUTHORIZED);
    }
    if (Date.now() >= new Date(data.expire_at ?? '').getTime()) {
        throw new RelayError(inviteStatusErrors.inviteExpired, httpCodes.UNAUTHORIZED);
    }
    return res.status(httpCodes.OK).json({ message: 'inviteValid', email: data.email });
};

export default ApiHandler({
    postHandler,
    getHandler,
});
