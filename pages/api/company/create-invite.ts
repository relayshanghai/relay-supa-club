import { NextApiRequest, NextApiResponse } from 'next';
import { APP_URL, emailRegex } from 'src/constants';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';
import { InvitesDB } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, company_id, name } = JSON.parse(req.body);
        if (!email || !company_id)
            return res.status(500).json({ error: 'Missing required fields' });

        if (!emailRegex.test(email)) return res.status(500).json({ error: 'Invalid email' });

        const existingInvite = await supabase
            .from<InvitesDB>('invites')
            .select('*')
            .eq('email', email)
            .eq('company_id', company_id)
            .limit(1)
            .single();

        if (
            existingInvite.data?.expire_at &&
            existingInvite.data.used === false &&
            Date.now() < new Date(existingInvite.data.expire_at).getTime()
        )
            return res.status(500).json({ error: 'Invite already exists and has not expired' });

        const { data, error } = await supabase
            .from<InvitesDB>('invites')
            .insert({
                email,
                company_id
            })
            .single();

        if (error) return res.status(500).json(error);
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
            <a href="${APP_URL}/signup/invite?token=${data.id}" style="background-color: #8B5CF6; color: white; margin: 5px; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Accept Invite</a>
            <p>If you did not request this invite, you can safely ignore this email.</p>
            <p>Thanks,</p>
            <p style="margin-top: 16px">The Relay Team</p>
            </div>
            `
            });
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.log('Error sending email', error);
            return res.status(500).json({ error: 'Error sending email' });
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
