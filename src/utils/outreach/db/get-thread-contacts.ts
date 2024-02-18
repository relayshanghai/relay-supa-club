import { email_contacts, thread_contacts, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, inArray } from 'drizzle-orm';

type GetThreadContactsFn = (
    account: string,
    ...threadIds: string[]
) => Promise<
    {
        thread_contacts: typeof thread_contacts.$inferSelect;
        threads: typeof threads.$inferSelect | null;
        email_contacts: typeof email_contacts.$inferSelect | null;
    }[]
>;

export const getThreadContacts: DBQuery<GetThreadContactsFn> =
    (drizzlePostgresInstance) =>
    async (account, ...threadIds: string[]) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(thread_contacts)
            .leftJoin(threads, eq(threads.thread_id, thread_contacts.thread_id))
            .leftJoin(email_contacts, eq(email_contacts.id, thread_contacts.email_contact_id))
            .where(
                and(
                    eq(threads.email_engine_account_id, account),
                    inArray(thread_contacts.thread_id, threadIds),
                    isNull(thread_contacts.deleted_at),
                ),
            );

        return rows;
    };
