import type { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_DOMAIN } from 'src/constants';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import { createEmployeeError } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db';
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
import { serverLogger } from 'src/utils/logger-server';

export type CreateEmployeePostBody = {
    email: string;
};
export type CreateEmployeePostResponse = ProfileDB;

const relayCompanyConfig = {
    name: RELAY_DOMAIN,
    website: 'https://relay.club',
    email: 'tech@relay.club',
};
const getOrCreateRelayCompany = async () => {
    try {
        let relayCompany: CompanyDB | null = null;
        const { data } = await getCompanyByName(relayCompanyConfig.name);
        if (data) {
            relayCompany = data;
        }
        if (!relayCompany?.id) {
            const { data: companyCreated, error: createRelayCompanyError } = await createCompany({
                name: relayCompanyConfig.name,
                website: relayCompanyConfig.website,
            });
            if (createRelayCompanyError || !companyCreated?.id) {
                serverLogger(createRelayCompanyError);
                throw new Error(createRelayCompanyError?.message ?? 'Missing company id.');
            }
            relayCompany = companyCreated;
        }
        // our seed data doesn't have cus_id, and other data ready so we need to check for each type and fill it
        if (!relayCompany.cus_id) {
            const customer = await stripeClient.customers.create({
                name: relayCompanyConfig.name,
                email: relayCompanyConfig.email,
                metadata: {
                    company_id: relayCompany.id,
                },
            });
            await updateCompany({ id: relayCompany.id, cus_id: customer.id });
        }
        if (!relayCompany.subscription_status || relayCompany.subscription_status !== 'active') {
            await updateCompanySubscriptionStatus({
                subscription_status: 'active',
                id: relayCompany.id,
                subscription_current_period_end: new Date('2050-1-1').toISOString(),
                subscription_current_period_start: new Date().toISOString(),
                subscription_end_date: new Date('2050-1-1').toISOString(),
                subscription_start_date: new Date().toISOString(),
            });
        }
        if (!relayCompany.profiles_limit || relayCompany.profiles_limit !== '100000000') {
            await updateCompanyUsageLimits({
                id: relayCompany.id,
                profiles_limit: '100000000',
                searches_limit: '1000000000',
                ai_email_generator_limit: '1000000000',
            });
        }
        return { data: relayCompany, error: null };
    } catch (error) {
        serverLogger(error);
        return { data: null, error };
    }
};

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body as CreateEmployeePostBody;
    if (!EMPLOYEE_EMAILS.includes(email)) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createEmployeeError.isNotEmployee });
    }
    const { data: company, error: getOrcreateCompanyError } = await getOrCreateRelayCompany();

    if (!company?.id || getOrcreateCompanyError) {
        serverLogger(getOrcreateCompanyError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }

    const { data: profile, error: getProfileError } = await getProfileByEmail(email);
    if (getProfileError) {
        serverLogger(getProfileError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const { error: makeAdminError } = await updateUserRole(profile.id, 'relay_employee');
    if (makeAdminError) {
        serverLogger(makeAdminError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const { error: updateProfileError, data: updateProfileData } = await updateProfile({
        id: profile.id,
        company_id: company.id,
    });
    if (!updateProfileData || updateProfileError) {
        serverLogger(updateProfileError);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
    const response: CreateEmployeePostResponse = updateProfileData;

    return res.status(httpCodes.OK).json(response);
}

export default ApiHandler({
    postHandler,
});
