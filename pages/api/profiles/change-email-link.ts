import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { supabase } from 'src/utils/supabase-client';

export type ChangeEmailLinkBody = {
    oldMail: string;
    newMail: string;
    redirectUrl: string;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { oldMail, newMail } = req.body as ChangeEmailLinkBody;
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'email_change_new',
        email: oldMail,
        newEmail: newMail,
    });
    if (error) return res.status(httpCodes.BAD_REQUEST).json({ error: error.message });
    return res.status(httpCodes.OK).json(data);
};

export default ApiHandler({
    postHandler,
});
