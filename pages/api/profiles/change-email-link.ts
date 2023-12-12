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

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { oldMail, newMail, redirectUrl, name } = req.body as ChangeEmailLinkReqBody;
    // Read more about auth admin commands here: https://supabase.com/docs/reference/javascript/auth-admin-generatelink
    // This only sends confirmation mail to the new email, not the old one. To do that, we would need to enable secure email email change in supabase
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'email_change_new',
        email: oldMail,
        newEmail: newMail,
        options: {
            redirectTo: `${redirectUrl}/login?${new URLSearchParams({ email: newMail })}`, // The redirect url must be allowed using wildcards in supabase Authentication settings
        },
    });
    if (error) return res.status(httpCodes.BAD_REQUEST).json({ error: error.message });
    await sendEmailChangeVerificationEmail(newMail, name, data.properties?.action_link);
    return res.status(httpCodes.OK).json({ success: true });
};

export default ApiHandler({
    postHandler,
});
