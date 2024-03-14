import type { NextApiHandler } from 'next';
import { emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createInviteErrors } from 'src/errors/company';
import { sendInviteEmail } from 'src/utils/api/brevo/send-template-transac-email';
import { getProfileByEmail, getExistingInvite, insertInvite, getCompanyById } from 'src/utils/api/db';
import type { InvitesDB } from 'src/utils/api/db/types';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { getHostnameFromRequest } from 'src/utils/get-host';
import { serverLogger } from 'src/utils/logger-server';

export interface CompanyCreateInvitePostBody {
    email: string;
    company_id: string;
    name: string;
    companyOwner?: boolean;
}
export type CompanyCreateInvitePostResponse = InvitesDB;

const formatLink = (companyName: string, token: string, appUrl: string) => {
    return `${appUrl}/signup/invite?${new URLSearchParams({
        token,
    })}`;
};
const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    const { email, company_id, name, companyOwner } = req.body as CompanyCreateInvitePostBody;

    if (!email || !company_id)
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.missingRequiredFields });

    let company = null;

    try {
        company = await getCompanyById(company_id);
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Error', {
                error: 'Cannot get company',
                company_id,
            });
        });
    }

    if (!company || !company.name) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.missingRequiredFields });
    }

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

    if (existingInvite?.expire_at && existingInvite.used === true)
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.inviteAlreadyExists });

    const insertData = await insertInvite({ email, company_id, company_owner: companyOwner });

    const { appUrl } = getHostnameFromRequest(req);

    try {
        await sendInviteEmail(email, name, company.name, formatLink(company.name, insertData.id, appUrl));
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const returnData: CompanyCreateInvitePostResponse = insertData;

    return res.status(httpCodes.OK).json(returnData);
};

export default handler;
