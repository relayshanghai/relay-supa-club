import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getCompanyByName, getCompanyName, updateCompany } from 'src/utils/api/db/calls/company';
import type { CompanyDB, CompanyDBUpdate } from 'src/utils/api/db/types';
import { serverLogger } from 'src/utils/logger-server';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { updateCompanyErrors } from 'src/errors/company';

export interface CompanyPutBody extends CompanyDBUpdate {
    id: string;
}
export type CompanyPutResponse = CompanyDB;

const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const updateData = req.body as CompanyPutBody;
            if (!updateData.id) {
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });
            }

            if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
                return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
            }

            if (updateData.name) {
                try {
                    const { data } = await getCompanyName(updateData.id);
                    if (data?.name !== updateData.name) {
                        const { data: companyWithSameName } = await getCompanyByName(updateData.name);
                        if (companyWithSameName) {
                            return res
                                .status(httpCodes.BAD_REQUEST)
                                .json({ error: updateCompanyErrors.companyWithSameNameExists });
                        }
                    }
                } catch (error) {
                    serverLogger(error);
                }
            }

            const company = await updateCompany(updateData);

            if (!company || !company.cus_id || !company.name || !company.website) {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Missing company data' });
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

            const returnData: CompanyPutResponse = company;

            return res.status(httpCodes.OK).json(returnData);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'error updating company' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
};

export default handler;
