import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createContact } from 'src/utils/api/brevo';
import type { ProfileDB, ProfileDBInsert, ProfileDBUpdate } from 'src/utils/api/db';
import { insertProfile } from 'src/utils/api/db';
import { updateProfile } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';

export type ProfilePutBody = ProfileDBUpdate & { id: string };
export type ProfilePutResponse = ProfileDB;
export type ProfileInsertBody = ProfileDBInsert;

// Brevo List ID of the newly signed up trial users that will be funneled to an marketing automation
const BREVO_NEWTRIALUSERS_LIST_ID = process.env.BREVO_NEWTRIALUSERS_LIST_ID ?? null;

const createBrevoContact = async (profile: ProfileDBInsert) => {
    if (!profile.email || !BREVO_NEWTRIALUSERS_LIST_ID) return false;

    try {
        return await createContact({
            email: profile.email,
            attributes: {
                FIRSTNAME: profile.first_name,
                LASTNAME: profile.last_name,
            },
            listIds: [Number(BREVO_NEWTRIALUSERS_LIST_ID)],
        });
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Error', {
                error: 'Cannot create brevo contact',
                email: profile.email,
                listId: BREVO_NEWTRIALUSERS_LIST_ID,
            });
        });
        return false;
    }
};

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

            await createBrevoContact(profile);

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
