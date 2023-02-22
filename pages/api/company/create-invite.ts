import { NextApiRequest, NextApiResponse } from 'next';

import { APP_URL, emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createInviteErrors } from 'src/errors/company';
import { getProfileByEmail, InvitesDB } from 'src/utils/api/db';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';

export interface CompanyCreateInvitePostBody {
    email: string;
    company_id: string;
    name: string;
    companyOwner?: boolean;
}
export type CompanyCreateInvitePostResponse = InvitesDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, company_id, name, companyOwner } = req.body as CompanyCreateInvitePostBody;
        if (!email || !company_id)
            return res
                .status(httpCodes.BAD_REQUEST)
                .json({ error: createInviteErrors.missingRequiredFields });

        if (!emailRegex.test(email))
            return res
                .status(httpCodes.BAD_REQUEST)
                .json({ error: createInviteErrors.invalidEmail });

        if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
            return res
                .status(httpCodes.UNAUTHORIZED)
                .json({ error: 'This action is limited to company admins' });
        }
        try {
            const { data: existingAccount } = await getProfileByEmail(email);
            if (existingAccount) {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createInviteErrors.userAlreadyExists });
            }
        } catch (error) {
            serverLogger(error, 'error');
        }
        const { data: existingInvite } = await supabase
            .from('invites')
            .select('expire_at, used')
            .eq('email', email)
            .eq('company_id', company_id)
            .limit(1)
            .single();

        if (
            existingInvite?.expire_at &&
            existingInvite.used === false &&
            Date.now() < new Date(existingInvite.expire_at).getTime()
        )
            return res
                .status(httpCodes.BAD_REQUEST)
                .json({ error: createInviteErrors.inviteExistsAndHasNotExpired });

        const { data: insertData, error: insertError } = await supabase
            .from('invites')
            .insert({
                email,
                company_id,
                company_owner: companyOwner ?? false,
            })
            .select()
            .single();

        if (insertError) {
            serverLogger(insertError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        if (!insertData) return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        try {
            await sendEmail({
                email,
                name,
                subject: 'You have been invited to join a company on relay.club',
                html: `
            <div style="padding: 5px; line-height: 2.5rem">
            <h1>Hi ${name},</h1>
            <p>You have been invited to join a company on relay.club.</p>
            <p>Click the button below to accept the invite.</p>
            <a href="${APP_URL}/signup/invite?${new URLSearchParams({
                    token: insertData.id,
                })}" style="background-color: #8B5CF6; color: white; margin: 5px; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Accept Invite</a>
            <p>If you did not request this invite, you can safely ignore this email.</p>
            <p>Thanks,</p>
            <p style="margin-top: 16px">The Relay Team</p>
            </div>
            `,
            });
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        const returnData: CompanyCreateInvitePostResponse = insertData;

        return res.status(httpCodes.OK).json(returnData);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
