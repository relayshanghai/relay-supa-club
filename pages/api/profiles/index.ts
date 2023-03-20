import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { ProfileDB, ProfileDBUpdate} from 'src/utils/api/db';
import { getProfileById, updateProfile } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';

export type ProfileGetQuery = {
    /** user id from session */
    id: string;
};
export type ProfileGetResponse = ProfileDB;

export type ProfilePutBody = ProfileDBUpdate & { id: string };
export type ProfilePutResponse = ProfileDB;

const Handler: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query as ProfileGetQuery;

        if (!id) {
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'missing id' });
        }
        try {
            const matchesSession = await checkSessionIdMatchesID(id, req, res);
            if (!matchesSession) {
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'user is unauthorized for this action',
                });
            }
            const { data, error: profileGetError } = await getProfileById(id);
            if (profileGetError) {
                serverLogger(profileGetError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const result: ProfileGetResponse = data;
            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    if (req.method === 'PUT') {
        const profile = req.body as ProfilePutBody;

        try {
            const matchesSession = await checkSessionIdMatchesID(profile.id, req, res);
            if (!matchesSession) {
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'user is unauthorized for this action',
                });
            }
            const { data, error: profileUpdateError } = await updateProfile(profile);
            if (profileUpdateError) {
                serverLogger(profileUpdateError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const result: ProfilePutResponse = data;
            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
};

export default Handler;
