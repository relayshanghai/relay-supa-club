import { NextApiRequest, NextApiResponse } from 'next';
import { APP_URL, emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { InvitesDB } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';

export interface CompanyCreateInvitePostBody {
    email: string;
    company_id: string;
    name: string;
}
export type CompanyCreateInvitePostResponse = InvitesDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, company_id, name } = JSON.parse(req.body);
        if (!email || !company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing required fields' });

        if (!emailRegex.test(email))
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid email' });

        const { data: existingInvite } = await supabase
            .from('invites')
            .select('expire_at, used')
            .eq('email', email)
            .eq('company_id', company_id)
            .limit(1)
            .single();

        if (
            existingInvite?.expire_at &&
            existingInvite.used === false &&
            Date.now() < new Date(existingInvite.expire_at).getTime()
        )
            return res
                .status(httpCodes.BAD_REQUEST)
                .json({ error: 'Invite already exists and has not expired' });

        const { data: insertData, error: insertError } = await supabase
            .from('invites')
            .insert({
                email,
                company_id
            })
            .select()
            .single();

        if (insertError) {
            serverLogger(insertError, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(insertError);
        }
        if (!insertData)
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Error creating invite' });
        try {
            await sendEmail({
                email,
                name,
                subject: 'You have been invited to join a company on Relay.Club',
                html: `
            <div style="padding: 5px; line-height: 2.5rem">
            <h1>Hi ${name},</h1>
            <p>You have been invited to join a company on the Supabase Dashboard.</p>
            <p>Click the button below to accept the invite.</p>
            <a href="${APP_URL}/signup/invite?token=${insertData.id}" style="background-color: #8B5CF6; color: white; margin: 5px; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Accept Invite</a>
            <p>If you did not request this invite, you can safely ignore this email.</p>
            <p>Thanks,</p>
            <p style="margin-top: 16px">The Relay Team</p>
            </div>
            `
            });
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Error sending email' });
        }

        return res.status(httpCodes.OK).json(insertData);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
