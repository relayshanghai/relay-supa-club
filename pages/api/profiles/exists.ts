import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createInviteErrors } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import { getProfileByEmail } from 'src/utils/api/db/calls/profiles';
import { db } from 'src/utils/supabase-client';
import { z } from 'zod';

const RequestQuery = z.object({
    email: z.string(),
});

type ResponseBody = { message: string } | { error: string };

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<ResponseBody>) => {
    const query = RequestQuery.safeParse(req.query);

    if (!query.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Bad request' });
    }

    const { email: untrimmedEmail } = query.data;

    const email = untrimmedEmail.trim();

    const profiles = await db<typeof getProfileByEmail>(getProfileByEmail)(email);

    if (profiles?.length && profiles?.length > 0) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: createInviteErrors.userAlreadyExists });
    }

    return res.status(200).json({ message: `Email available` });
};

export default ApiHandler({
    getHandler,
});
