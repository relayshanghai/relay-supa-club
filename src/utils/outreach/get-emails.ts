import type { emails } from 'drizzle/schema';
import { getEmails as getEmailsFromDb } from 'src/utils/outreach/db/get-emails';
import { parseContacts } from './parse-contacts';
import type { Data as EmailData } from 'types/email-engine/webhook-message-new';

const transformEmails = (mails: (typeof emails.$inferSelect)[]) => {
    return mails.map((mail) => {
        const { date, unseen, id, from, cc, replyTo, text, subject, attachments } = mail.data as EmailData;
        return {
            date,
            unread: unseen || false,
            id,
            from,
            to: parseContacts(mail.recipients),
            attachments: attachments,
            cc: cc || [],
            replyTo,
            subject,
            body: text.html,
        };
    });
};

export const getEmails = async (threadId: string) => {
    return transformEmails(await getEmailsFromDb()(threadId));
};
