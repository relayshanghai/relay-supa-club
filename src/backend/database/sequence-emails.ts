import { sequence_emails } from 'drizzle/schema';
import { db } from 'src/utils/database';
import { eq } from 'drizzle-orm';

export type SequenceEmailInsert = typeof sequence_emails.$inferInsert;

export type SequenceEmailUpdate = [id: string, update: Partial<typeof sequence_emails.$inferSelect>];

export const updateSequenceEmailCall: (
    ...update: SequenceEmailUpdate
) => Promise<typeof sequence_emails.$inferSelect> = async (id, updates) => {
    const result = await db()
        .update(sequence_emails)
        .set({
            id,
            ...updates,
        })
        .where(eq(sequence_emails.id, id))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating row');

    return result[0];
};

export const insertSequenceEmailsCall: (
    inserts: SequenceEmailInsert[],
) => Promise<typeof sequence_emails.$inferSelect> = async (inserts) => {
    if (!inserts.every((insert) => insert.email_engine_account_id)) {
        // This column was added later and is not 'not null', so add this check for any new ones
        throw new Error('Missing required email_engine_account_id');
    }
    const result = await db().insert(sequence_emails).values(inserts).returning();
    if (result.length !== inserts.length) throw new Error('Error in inserting row');

    return result[0];
};
