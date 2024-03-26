import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getTeammatesByCompanyId, updateTeammateRole } from 'src/utils/api/db';
import type { ProfileDB } from 'src/utils/api/db/types';
import { z } from 'zod';

export type CompanyTeammatesGetQueries = {
    /** company id */
    id: string;
};

export const UpdateTeammateRoleSchema = z.object({
    id: z.string(),
    role: z.enum(['company_owner', 'company_teammate']),
});

export const DeleteTeammateRoleSchema = z.object({
    id: z.string(),
    role: z.enum(['company_owner', 'company_teammate']),
});

export type CompanyTeammatesGetResponse = ProfileDB[];

const handler: NextApiHandler = async (req, res) => {
    switch (req.method) {
        case 'GET':
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
        case 'PUT':
            try {
                const parsedBody = UpdateTeammateRoleSchema.parse(req.body);
                const { id, role } = parsedBody;
                const teammate: CompanyTeammatesGetResponse[number] = await updateTeammateRole(id, role);
                return res.status(httpCodes.OK).json(teammate);
            } catch (error) {
                return res.status(httpCodes.BAD_REQUEST).json({ message: 'Invalid id or role' });
            }

        default:
            return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
};

export default handler;
