import type { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_DOMAIN } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import type { CompanyDB } from 'src/utils/api/db';
import { createCompany, getAllCompanyNames, updateCompany, updateProfile, updateUserRole } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';

export type CompanyCreatePostBody = {
    user_id: string;
    name: string;
    website?: string;
};
export type CompanyCreatePostResponse = CompanyDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { user_id, name: untrimmedName, website } = req.body as CompanyCreatePostBody;
            const name = untrimmedName.trim();
            if (!user_id || !name) {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            // Do not allow users to create a company with our reserved name for internal employees
            if (name.toLowerCase() === RELAY_DOMAIN.toLowerCase()) {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }

            try {
                const { data: companyNames } = await getAllCompanyNames();
                const companyWithSameName = companyNames?.find(
                    (companyName) => companyName.name?.toLowerCase() === name.toLowerCase(),
                );
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

            if (!profile || profileError) {
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
            const companyFinal = await updateCompany({ id: company.id, cus_id: customer.id });
            const response: CompanyCreatePostResponse = companyFinal;

            return res.status(httpCodes.OK).json(response);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
