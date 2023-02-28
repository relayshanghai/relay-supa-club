import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getTeammatesByCompanyId } from 'src/utils/api/db';
import type { ProfileDB } from 'src/utils/api/db/types';

export type CompanyTeammatesGetQueries = {
    /** company id */
    id: string;
};

export type CompanyTeammatesGetResponse = ProfileDB[];

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const { id } = req.query as CompanyTeammatesGetQueries;
        if (!id) {
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'Missing id' });
        }
        const teammates = await getTeammatesByCompanyId(id);
        const result: CompanyTeammatesGetResponse = teammates;
        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
