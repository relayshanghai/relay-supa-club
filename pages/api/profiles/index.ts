import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ProfileDB, ProfileInsertDB, upsertProfile } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/fetcher';
import { serverLogger } from 'src/utils/logger';

export type ProfilePutBody = ProfileInsertDB;
export type ProfilePutResponse = ProfileDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const profile = JSON.parse(req.body) as ProfilePutBody;

        try {
            //check profile id matches session user id
            await checkSessionIdMatchesID(profile.id, res);

            const { data, error: profileUpsertError } = await upsertProfile(profile);
            if (profileUpsertError) {
                serverLogger(profileUpsertError, 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(profileUpsertError);
            }
            return res.status(httpCodes.OK).json(data);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error updating profile'
            });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
