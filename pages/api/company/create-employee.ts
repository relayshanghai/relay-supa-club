import type { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_DOMAIN } from 'src/constants';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import { createEmployeeError } from 'src/errors/company';
import type {
    ProfileDB} from 'src/utils/api/db';
import {
    createCompany,
    getCompanyByName,
    getProfileByEmail,
    updateCompany,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
    updateProfile,
    updateUserRole,
} from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';

export type CreateEmployeePostBody = {
    email: string;
};
export type CreateEmployeePostResponse = ProfileDB;

const relayCompanyConfig = {
    name: RELAY_DOMAIN,
    website: 'https://relay.club',
    email: 'tech@relay.club',
};
const getOrCreateCompany = async () => {
    const { data: relayCompany } = await getCompanyByName(relayCompanyConfig.name);

    if (relayCompany) {
        return { data: relayCompany, error: null };
    }
    const { data: companyCreated, error: createRelayCompanyError } = await createCompany({
        name: relayCompanyConfig.name,
        website: relayCompanyConfig.website,
    });
    if (createRelayCompanyError || !companyCreated?.id) {
        return { data: null, error: createRelayCompanyError ?? 'Missing company id.' };
    }
    const customer = await stripeClient.customers.create({
        name: relayCompanyConfig.name,
        email: relayCompanyConfig.email,
        metadata: {
            company_id: companyCreated.id,
        },
    });
    await updateCompany({ id: companyCreated.id, cus_id: customer.id });
    await updateCompanySubscriptionStatus({
        subscription_status: 'active',
        id: companyCreated.id,
        subscription_current_period_end: new Date('2050-1-1').toISOString(),
        subscription_current_period_start: new Date().toISOString(),
        subscription_end_date: new Date('2050-1-1').toISOString(),
        subscription_start_date: new Date().toISOString(),
    });
    await updateCompanyUsageLimits({
        id: companyCreated.id,
        profiles_limit: '100000000',
        searches_limit: '1000000000',
        ai_email_generator_limit: '1000000000',
    });

    return { data: companyCreated, error: null };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email } = req.body as CreateEmployeePostBody;
            if (!EMPLOYEE_EMAILS.includes(email)) {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createEmployeeError.isNotEmployee });
            }
            const { data: company, error: getOrCreateCompanyError } = await getOrCreateCompany();
            if (!company) {
                serverLogger(getOrCreateCompanyError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const { data: profile, error: getProfileError } = await getProfileByEmail(email);
            if (getProfileError) {
                serverLogger(getProfileError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const { error: makeAdminError } = await updateUserRole(profile.id, 'relay_employee');
            if (makeAdminError) {
                serverLogger(makeAdminError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const { error: updateProfileError, data: updateProfileData } = await updateProfile({
                id: profile.id,
                company_id: company.id,
            });
            if (!updateProfileData || updateProfileError) {
                serverLogger(updateProfileError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const response: CreateEmployeePostResponse = updateProfileData;

            return res.status(httpCodes.OK).json(response);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
