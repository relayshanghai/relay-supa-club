import { email_contacts, thread_contacts } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull } from 'drizzle-orm';

type GetThreadContactsFn = (threadId: string) => Promise<
    {
        thread_contacts: typeof thread_contacts.$inferSelect;
        email_contacts: typeof email_contacts.$inferSelect | null;
    }[]
>;

export const getThreadContacts: DBQuery<GetThreadContactsFn> = (i) => async (threadId: string) => {
    const rows = await db(i)
        .select()
        .from(thread_contacts)
        .leftJoin(email_contacts, eq(email_contacts.id, thread_contacts.email_contact_id))
        .where(and(eq(thread_contacts.thread_id, threadId), isNull(thread_contacts.deleted_at)));

    return rows;
};
