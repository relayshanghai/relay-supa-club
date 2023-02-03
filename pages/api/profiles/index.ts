import { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ProfileDB, ProfileInsertDB, updateProfile } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/fetcher';
import { serverLogger } from 'src/utils/logger';

export type ProfilePutBody = ProfileInsertDB;
export type ProfilePutResponse = ProfileDB;

const Handler: NextApiHandler = async (req, res) => {
    // Create authenticated Supabase Client
    if (req.method === 'PUT') {
        const profile = JSON.parse(req.body) as ProfilePutBody;

        try {
            const matchesSession = await checkSessionIdMatchesID(profile.id, req, res);
            if (!matchesSession) {
                return res.status(httpCodes.UNAUTHORIZED).json({
                    error: 'user is unauthorized for this action',
                });
            }
            const { data, error: profileUpsertError } = await updateProfile(profile);
            if (profileUpsertError) {
                serverLogger(profileUpsertError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            return res.status(httpCodes.OK).json(data);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
};

export default Handler;
