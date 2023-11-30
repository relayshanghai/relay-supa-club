import type { NextApiRequest, NextApiResponse } from 'next';
import { LEGACY_RELAY_DOMAIN, emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db';
import { deleteUserById, findCompaniesByNames } from 'src/utils/api/db';
import { createCompany, updateCompany, updateProfile, updateUserRole } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { db, supabase } from 'src/utils/supabase-client';
import { CompanySize } from 'types';
import { z } from 'zod';
import { addCompanyCategory } from 'src/utils/api/db/calls/company-categories';
import { RelayError } from 'src/errors/relay-error';
import { createContact } from 'src/utils/api/brevo';
import type { ProfileInsertBody } from '../profiles';

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

const createServiceAccount = async (company: CompanyDB) => {
    try {
        const password = process.env.SERVICE_ACCOUNT_PASSWORD ?? 'password123!';

        const email = `support+${company.cus_id?.toLowerCase().trim()}@boostbot.ai`;
        const emailCheck = emailRegex.test(email);
        if (!emailCheck) {
            serverLogger('email invalid: ' + email);
            return;
        }
        const { error, data: signupResData } = await supabase.auth.signUp({
            email,
            password,
        });
        let id = signupResData?.user?.id;
        if (error?.message.includes('User already registered')) {
            const { error: error2, data: signInResData } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            id = signInResData?.user?.id;
            if (error2) {
                serverLogger(error2?.message || 'Unknown error signing in' + email);
                return;
            }
        }

        if (!id) {
            serverLogger('Error creating profile, no id in response');
            return;
        }
        const profileBody: ProfileInsertBody = {
            id,
            email,
            company_id: company.id,
            first_name: 'BoostBot',
            last_name: 'Support',
            user_role: 'company_owner',
        };
        const { data, error: error2 } = await supabase.from('profiles').upsert(profileBody).select('*').single();
        if (!data || error2) {
            serverLogger('error inserting profile ' + error2?.message || 'unknown error');
        }
    } catch (error) {
        serverLogger(error, (scope) =>
            scope.setContext('Error', {
                error: 'Cannot create service account',
                company,
            }),
        );
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
    await createServiceAccount(companyFinal);

    const response: CompanyCreatePostResponse = companyFinal;

    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
