import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { RELAY_DOMAIN } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import { findCompaniesByNames, getTeammatesByCompanyId } from 'src/utils/api/db';
import { db } from 'src/utils/supabase-client';
import { z } from 'zod';

const RequestQuery = z.object({
    name: z.string(),
});

type ResponseBody = { message: string } | { error: string };

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<ResponseBody>) => {
    const query = RequestQuery.safeParse(req.query);

    if (!query.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Bad request' });
    }

    const { name: untrimmedName } = query.data;

    const name = untrimmedName.trim();

    // Do not allow users to create a company with our reserved name for internal employees
    if (name.toLowerCase() === RELAY_DOMAIN.toLowerCase()) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid Request' });
    }

    const companies = await db<typeof findCompaniesByNames>(findCompaniesByNames)(name.toLowerCase());

    if (companies.length > 0) {
        const owners = await getTeammatesByCompanyId(companies[0].id);
        if (owners && owners.length > 0) {
            return res
                .status(httpCodes.BAD_REQUEST)
                .json({ error: owners[0].email ?? createCompanyErrors.companyWithSameNameExists });
        } else {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR);
        }
    }

    return res.status(200).json({ message: `Company name available` });
};

export default ApiHandler({
    getHandler,
});
