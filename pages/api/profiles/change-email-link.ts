import type { GenerateLinkProperties, User } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { sendEmailChangeVerificationEmail } from 'src/utils/api/brevo/send-template-transac-email';
import { supabase } from 'src/utils/supabase-client';

export type ChangeEmailLinkReqBody = {
    name: string;
    oldMail: string;
    newMail: string;
    redirectUrl: string;
};

export type ChangeEmailLinkResBody = {
    properties: GenerateLinkProperties;
    user: User;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { oldMail, newMail, redirectUrl, name } = req.body as ChangeEmailLinkReqBody;
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'email_change_new',
        email: oldMail,
        newEmail: newMail,
        options: {
            redirectTo: `${redirectUrl}/login?${new URLSearchParams({ email: newMail })}`,
        },
    });
    if (error) return res.status(httpCodes.BAD_REQUEST).json({ error: error.message });
    await sendEmailChangeVerificationEmail(newMail, name, data.properties?.action_link);
    return res.status(httpCodes.OK).json({ success: true });
};

export default ApiHandler({
    postHandler,
});
