import type { NextApiHandler } from 'next';
import { emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createInviteErrors } from 'src/errors/company';
import { getProfileByEmail, getExistingInvite, insertInvite } from 'src/utils/api/db';
import type { InvitesDB } from 'src/utils/api/db/types';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { getHostnameFromRequest } from 'src/utils/get-host';
import { serverLogger } from 'src/utils/logger-server';
import { sendEmail } from 'src/utils/send-in-blue-client';

export interface CompanyCreateInvitePostBody {
    email: string;
    company_id: string;
    name: string;
    companyOwner?: boolean;
}
export type CompanyCreateInvitePostResponse = InvitesDB;

const formatEmail = (name: string, token: string, appUrl: string) => {
    const link = `${appUrl}/signup/invite?${new URLSearchParams({
        token,
    })}`;
    return `
    <div style="padding: 5px; line-height: 2.5rem">
        <h1>Hi ${name},</h1>
        <p>You have been invited to join a company on BoostBot雷宝</p>
        <p>Click the button below to accept the invite.</p>
        <a href="${link}" style="background-color: #8B5CF6; color: white; margin: 5px; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Accept Invite</a>
        <p>If you did not request this invite, you can safely ignore this email.</p>
        <p>Thanks,</p>
        <p style="margin-top: 16px">The Relay Team</p>
    </div>
    `;
};
const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    const { email, company_id, name, companyOwner } = req.body as CompanyCreateInvitePostBody;
    if (!email || !company_id)
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.missingRequiredFields });

    if (!emailRegex.test(email))
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.invalidEmail });

    if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
    }
    try {
        const { data: existingAccount } = await getProfileByEmail(email);
        if (existingAccount) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.userAlreadyExists });
        }
    } catch (error) {
        serverLogger(error);
    }
    const existingInvite = await getExistingInvite(email, company_id);

    if (
        existingInvite?.expire_at &&
        existingInvite.used === false &&
        Date.now() < new Date(existingInvite.expire_at).getTime()
    )
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.inviteExistsAndHasNotExpired });

    const insertData = await insertInvite({ email, company_id, company_owner: companyOwner });

    const { appUrl } = getHostnameFromRequest(req);

    try {
        await sendEmail({
            email,
            name,
            subject: 'You have been invited to join a company on boostbot.ai',
            html: formatEmail(name, insertData.id, appUrl),
        });
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const returnData: CompanyCreateInvitePostResponse = insertData;

    return res.status(httpCodes.OK).json(returnData);
};

export default handler;
