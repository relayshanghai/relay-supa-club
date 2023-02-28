import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getInvitesByCompany } from 'src/utils/api/db';
import type { InvitesDB } from 'src/utils/api/db/types';

export type InvitesGetQueries = {
    /** company id */
    id: string;
};

export type InvitesGetResponse = InvitesDB[];

const invites: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const { id } = req.query as InvitesGetQueries;
    if (!id) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    const invites = await getInvitesByCompany(id);
    const result: InvitesGetResponse = invites;

    return res.status(httpCodes.OK).json(result);
};

export default invites;
