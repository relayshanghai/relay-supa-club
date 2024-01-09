import { email_contacts } from 'drizzle/schema';
import type { EmailContact } from '../types';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';
import { eq } from 'drizzle-orm';

type CreateEmailContactFn = (contact: EmailContact) => Promise<typeof email_contacts.$inferSelect>;

export const createEmailContact: DBQuery<CreateEmailContactFn> = (drizzlePostgresInstance) => async (contact) => {
    let row = await db(drizzlePostgresInstance)
        .insert(email_contacts)
        .values({
            name: contact.name,
            address: contact.address,
        })
        .onConflictDoNothing({
            target: email_contacts.address,
        })
        .returning();

    if (row.length !== 1) {
        row = await db(drizzlePostgresInstance)
            .select()
            .from(email_contacts)
            .where(eq(email_contacts.address, contact.address))
            .limit(1);
    }

    if (row.length !== 1) throw new Error('Error inserting row');

    return row[0];
};
