import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CompanyDB, createCompany, updateCompany, updateProfile } from 'src/utils/api/db';
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
            const { user_id, name, website } = JSON.parse(req.body) as CompanyCreatePostBody;
            const { data: company, error } = await createCompany({ name, website });

            if (error || !company?.id) {
                serverLogger(error, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const { error: profileError } = await updateProfile({
                id: user_id,
                company_id: company.id,
                admin: true,
            });

            if (profileError) {
                serverLogger(profileError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const customer = await stripeClient.customers.create({
                name,
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
