import { NextApiRequest, NextApiResponse } from 'next';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import { createEmployeeError } from 'src/errors/company';
import {
    CompanyDB,
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
export type CreateEmployeePostResponse = CompanyDB;

const relayCompanyConfig = {
    name: 'relay.club',
    website: 'https://relay.club',
    email: 'tech@relay.club',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email } = JSON.parse(req.body) as CreateEmployeePostBody;

            if (!EMPLOYEE_EMAILS.includes(email)) {
                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({ error: createEmployeeError.isNotEmployee });
            }
            let company: CompanyDB | null = null;
            // if relay company doesn't exist, create it.
            const { data: relayCompany } = await getCompanyByName(relayCompanyConfig.name);
            if (!relayCompany) {
                const { data: companyCreated, error: createRelayCompanyError } =
                    await createCompany({
                        name: relayCompanyConfig.name,
                        website: relayCompanyConfig.website,
                    });
                if (createRelayCompanyError || !companyCreated?.id) {
                    serverLogger(createRelayCompanyError, 'error');
                    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
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
                });
                company = companyCreated;
            } else {
                company = relayCompany;
            }
            if (!company) {
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
            await updateProfile({ id: profile.id, company_id: company.id });

            const response: CreateEmployeePostResponse = company;
            return res.status(httpCodes.OK).json(response);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
