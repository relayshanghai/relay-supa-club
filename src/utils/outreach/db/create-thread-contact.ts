import { thread_contacts } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';
import type { THREAD_CONTACT_TYPE } from '../constants';
import { and, eq } from 'drizzle-orm';

type CreateThreadContactFn = (
    thread_id: string,
    contact_id: string,
    contact_type: THREAD_CONTACT_TYPE,
) => Promise<typeof thread_contacts.$inferSelect>;

export const createThreadContact: DBQuery<CreateThreadContactFn> =
    (i) => async (thread_id, contact_id, contact_type) => {
        const existing = await db(i)
            .select()
            .from(thread_contacts)
            .where(and(eq(thread_contacts.thread_id, thread_id), eq(thread_contacts.email_contact_id, contact_id)))
            .limit(1);

        if (existing.length > 0) {
            return existing[0];
        }

        const row = await db(i)
            .insert(thread_contacts)
            .values({
                thread_id,
                email_contact_id: contact_id,
                type: contact_type,
            })
            .returning();

        if (row.length !== 1) {
            throw new Error('Error in inserting row');
        }

        return row[0];
    };
