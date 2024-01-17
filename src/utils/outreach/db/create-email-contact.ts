import { email_contacts } from 'drizzle/schema';
import type { EmailContact } from '../types';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';
import { eq } from 'drizzle-orm';

type CreateEmailContactFn = (contact: EmailContact) => Promise<typeof email_contacts.$inferSelect>;

export const createEmailContact: DBQuery<CreateEmailContactFn> = (drizzlePostgresInstance) => async (contact) => {
    const trx = db(drizzlePostgresInstance)
        .insert(email_contacts)
        .values({
            name: contact.name || contact.address,
            address: contact.address,
        })
        .returning();
    // update the name when it conflicts on address and name is not empty
    if (contact.name) {
        trx.onConflictDoUpdate({
            target: email_contacts.address,
            set: {
                name: contact.name,
            },
        });
    } else
        trx.onConflictDoNothing({
            target: email_contacts.address,
        });
    let row = await trx;
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
