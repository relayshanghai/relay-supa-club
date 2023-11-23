import type { NextApiRequest, NextApiResponse } from 'next';
import { LEGACY_RELAY_DOMAIN } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db';
import { deleteUserById, findCompaniesByNames } from 'src/utils/api/db';
import { createCompany, updateCompany, updateProfile, updateUserRole } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';
import { CompanySize } from 'types';
import { z } from 'zod';
import { addCompanyCategory } from 'src/utils/api/db/calls/company-categories';
import { RelayError } from 'src/errors/relay-error';
import { createContact } from 'src/utils/api/brevo';

const CompanyCreatePostBody = z.object({
    user_id: z.string(),
    name: z.string(),
    website: z.string().optional(),
    size: CompanySize.optional(),
    category: z.string().optional(),
});

export type CompanyCreatePostBody = z.input<typeof CompanyCreatePostBody>;

export type CompanyCreatePostResponse = CompanyDB;

// Brevo List ID of the newly signed up trial users that will be funneled to an marketing automation
const BREVO_NEWTRIALUSERS_LIST_ID = process.env.BREVO_NEWTRIALUSERS_LIST_ID ?? null;

const createBrevoContact = async (profile: ProfileDB, company: CompanyDB) => {
    if (!profile.email || !company.name || !BREVO_NEWTRIALUSERS_LIST_ID) {
        return false;
    }

    try {
        return await createContact({
            email: profile.email,
            attributes: {
                FIRSTNAME: profile.first_name,
                LASTNAME: profile.last_name,
                COMPANYNAME: company.name,
            },
            listIds: [Number(BREVO_NEWTRIALUSERS_LIST_ID)],
        });
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Error', {
                error: 'Cannot create brevo contact',
                email: profile.email,
                listId: BREVO_NEWTRIALUSERS_LIST_ID,
            });
        });
        return false;
    }
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = CompanyCreatePostBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { user_id, name: untrimmedName, website, ...body } = result.data;

    const name = untrimmedName.trim();

    // Do not allow users to create a company with our reserved name for internal employees
    if (name.toLowerCase() === LEGACY_RELAY_DOMAIN.toLowerCase()) {
        await deleteUserById(user_id);
        return res.status(httpCodes.BAD_REQUEST).json({});
    }

    const companies = await db<typeof findCompaniesByNames>(findCompaniesByNames)(name.toLowerCase());

    if (companies.length > 0) {
        await deleteUserById(user_id);
        throw new RelayError(createCompanyErrors.companyWithSameNameExists, httpCodes.BAD_REQUEST);
    }

    const { data: company, error } = await createCompany({ name, website, size: body.size });

    if (error || !company?.id) {
        serverLogger(error);
        await deleteUserById(user_id);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    // @note temporarily allow company categories to be optional
    if (body.category) {
        await db<typeof addCompanyCategory>(addCompanyCategory)(company, body.category);
    }

    const { error: profileError, data: profile } = await updateProfile({
        id: user_id,
        company_id: company.id,
    });

    if (!profile || profileError) {
        serverLogger(profileError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    const { error: makeAdminError } = await updateUserRole(user_id, 'company_owner');

    if (makeAdminError) {
        serverLogger(makeAdminError);
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

    await createBrevoContact(profile, company);

    const response: CompanyCreatePostResponse = companyFinal;

    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
