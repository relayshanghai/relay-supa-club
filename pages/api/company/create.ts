import type { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_DOMAIN } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import { RelayError, ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB } from 'src/utils/api/db';
import { findCompaniesByNames } from 'src/utils/api/db';
import { createCompany, updateCompany, updateProfile, updateUserRole } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';
import type { CompanySize } from 'types';

export type CompanyCreatePostBody = {
    user_id: string;
    name: string;
    website?: string;
    company_size: CompanySize;
};
export type CompanyCreatePostResponse = CompanyDB;

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { user_id, name: untrimmedName, website } = req.body as CompanyCreatePostBody;
    const name = untrimmedName.trim();

    if (!user_id || !name) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }

    // Do not allow users to create a company with our reserved name for internal employees
    if (name.toLowerCase() === RELAY_DOMAIN.toLowerCase()) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }

    const companies = await db<typeof findCompaniesByNames>(findCompaniesByNames)(name);

    if (companies.length > 0) {
        throw new RelayError(createCompanyErrors.companyWithSameNameExists, httpCodes.BAD_REQUEST);
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
        serverLogger(makeAdminError, 'error', true);
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
};

export default ApiHandler({
    postHandler,
});
