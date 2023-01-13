import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CompanyDB, CompanyDBInsert, createCompany, updateProfile } from 'src/utils/api/db';
import { ensureCustomer } from 'src/utils/api/ensure-customer';
import { checkSessionIdMatchesID } from 'src/utils/fetcher';

export type CompanyCreatePostBody = CompanyDBInsert & {
    user_id: string;
};
export type CompanyCreatePostResponse = CompanyDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { user_id, name, website } = JSON.parse(req.body) as CompanyCreatePostBody;
        checkSessionIdMatchesID(user_id, res);
        const { data: company, error } = await createCompany({ name, website });

        if (error) return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);

        const { data: profile, error: profileError } = await updateProfile({
            id: user_id,
            company_id: company.id,
            admin: true
        });

        if (profileError) return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(profileError);

        // Create the customer in stripe as well
        // TODO: change this function to just return the cus_id, not add to company yet, until they confirm payment method?
        await ensureCustomer({ company_id: company.id, name });

        return res.status(httpCodes.OK).json({ profile, company });
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
