import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { ProfileDB, ProfileDBInsert, ProfileDBUpdate } from 'src/utils/api/db';
import { insertProfile } from 'src/utils/api/db';
import { updateProfile } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';

export type ProfilePutBody = ProfileDBUpdate & { id: string };
export type ProfilePutResponse = ProfileDB;
export type ProfileInsertBody = ProfileDBInsert;

const Handler: NextApiHandler = async (req, res) => {
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
                serverLogger(profileUpdateError);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const result: ProfilePutResponse = data;
            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    } else if (req.method === 'POST') {
        const profile = req.body as ProfileInsertBody;
        if (!profile.id || !profile.first_name || !profile.last_name) {
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'Missing required profile fields' });
        }
        const matchesSession = await checkSessionIdMatchesID(profile.id, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }

        try {
            const { error, data } = await insertProfile(profile);
            if (error) {
                serverLogger(error);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            const result: ProfilePutResponse = data;

            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    } else {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
};

export default Handler;
