import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { sendPasswordResetEmail } from 'src/utils/api/brevo/send-template-transac-email';
import { supabase } from 'src/utils/supabase-client';

export type ChangeEmailLinkReqBody = {
    name: string;
    email: string;
    redirectUrl: string;
};

export type ChangeEmailLinkResBody = {
    success?: boolean;
    error?: string;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, redirectUrl, name } = req.body as ChangeEmailLinkReqBody;
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
            redirectTo: `${redirectUrl}/login/reset-password/${email}`,
        },
    });
    if (error) return res.status(httpCodes.BAD_REQUEST).json({ error: error.message });
    await sendPasswordResetEmail(email, name ?? email, data.properties?.action_link);
    return res.status(httpCodes.OK).json({ success: true });
};

export default ApiHandler({
    postHandler,
});
