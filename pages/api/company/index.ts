import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import {
    CompanyWithProfilesInvitesAndUsage,
    getCompanyWithProfilesInvitesAndUsage,
    updateCompany,
} from 'src/utils/api/db/calls/company';
import { CompanyDB, CompanyDBUpdate } from 'src/utils/api/db/types';
import { serverLogger } from 'src/utils/logger';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

export type CompanyGetQueries = {
    id: string;
};
export type CompanyGetResponse = CompanyWithProfilesInvitesAndUsage;

export interface CompanyPostBody extends CompanyDBUpdate {
    id: string;
}
export type CompanyPostResponse = CompanyDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { id: companyId } = req.query as CompanyGetQueries;
            if (!companyId) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
            }

            const company = await getCompanyWithProfilesInvitesAndUsage(companyId);

            if (!company) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Company not found' });
            }

            return res.status(httpCodes.OK).json(company);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Error finding company' });
        }
    }

    if (req.method === 'POST') {
        try {
            const updateData = JSON.parse(req.body) as CompanyPostBody;
            if (!updateData.id) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
            }

            const company = await updateCompany(updateData);

            if (!company || !company.cus_id || !company.name || !company.website) {
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Missing company data' });
            }

            // if name or website changed, update stripe customer info
            if (updateData.name || updateData.website)
                await stripeClient.customers.update(company.cus_id, {
                    name: company.name,
                    description: company.website,
                    metadata: {
                        company_id: updateData.id,
                    },
                });

            return res.status(httpCodes.OK).json(company);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'error updating company' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
