import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import {
    CompanyDB,
    createCompany,
    getCompanyByName,
    updateCompany,
    updateProfile,
    updateUserRole,
} from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';

export type CompanyCreatePostBody = {
    user_id: string;
    name: string;
    website?: string;
};
export type CompanyCreatePostResponse = CompanyDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { user_id, name, website } = req.body as CompanyCreatePostBody;

            try {
                const { data: companyWithSameName } = await getCompanyByName(name);
                if (companyWithSameName) {
                    return res
                        .status(httpCodes.BAD_REQUEST)
                        .json({ error: createCompanyErrors.companyWithSameNameExists });
                }
            } catch (error) {
                serverLogger(error, 'error');
            }

            const { data: company, error } = await createCompany({ name, website });

            if (error || !company?.id) {
                serverLogger(error, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const { error: profileError, data: profile } = await updateProfile({
                id: user_id,
                company_id: company.id,
            });

            if (profileError) {
                serverLogger(profileError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const { error: makeAdminError } = await updateUserRole(user_id, 'company_owner');
            if (makeAdminError) {
                serverLogger(makeAdminError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const customer = await stripeClient.customers.create({
                name,
                email: profile.email || '',
                metadata: {
                    company_id: company.id,
                },
            });
            await updateCompany({ id: company.id, cus_id: customer.id });
            const response: CompanyCreatePostResponse = company;

            return res.status(httpCodes.OK).json(response);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
