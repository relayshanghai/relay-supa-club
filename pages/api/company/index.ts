import { NextApiRequest, NextApiResponse } from 'next';
import {
    CompanyWithProfilesInvitesAndUsage,
    getCompanyWithProfilesInvitesAndUsage,
    updateCompany
} from 'src/utils/api/db/calls/company';
import { CompanyDBUpdate } from 'src/utils/api/db/types';
import { stripeClient } from 'src/utils/stripe-client';

export type CompanyIndexGetQuery = CompanyWithProfilesInvitesAndUsage;

export interface CompanyIndexPostBody extends CompanyDBUpdate {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id as string;

        const { data, error } = await getCompanyWithProfilesInvitesAndUsage(companyId);
        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const updateData = JSON.parse(req.body) as CompanyIndexPostBody;

        const { data, error } = await updateCompany(updateData);

        if (error) return res.status(500).json(error);

        if (!data || !data.cus_id || !data.name || !data.website) {
            return res.status(500).json({ error: 'Missing data' });
        }

        // do we always want to update strip when we update company?
        await stripeClient.customers.update(data.cus_id, {
            name: data.name,
            description: data.website,
            metadata: {
                company_id: updateData.id
            }
        });

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
