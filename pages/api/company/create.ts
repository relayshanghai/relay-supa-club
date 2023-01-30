import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CompanyDB, CompanyDBInsert, createCompany, updateProfile } from 'src/utils/api/db';
import { ensureCustomer } from 'src/utils/api/stripe/ensure-customer';
import { serverLogger } from 'src/utils/logger';

export type CompanyCreatePostBody = CompanyDBInsert & {
    user_id: string;
};
export type CompanyCreatePostResponse = CompanyDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { user_id, name, website } = JSON.parse(req.body) as CompanyCreatePostBody;
            const { data: company, error } = await createCompany({ name, website });

            if (error) {
                serverLogger(error, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
            }

            const { data: profile, error: profileError } = await updateProfile({
                id: user_id,
                company_id: company.id,
                admin: true,
            });

            if (profileError) {
                serverLogger(profileError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(profileError);
            }

            // Create the customer in stripe as well
            await ensureCustomer({ company_id: company.id, name });

            return res.status(httpCodes.OK).json({ profile, company });
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error creating company',
            });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
