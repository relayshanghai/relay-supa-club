import { sequenceEmails } from 'drizzle/schema';
import { db } from 'src/utils/database';
import { eq } from 'drizzle-orm';

export type SequenceEmailInsert = typeof sequenceEmails.$inferInsert;

export type SequenceEmailUpdate = [id: string, update: Partial<typeof sequenceEmails.$inferSelect>];

export const updateSequenceEmailCall: (
    ...update: SequenceEmailUpdate
) => Promise<typeof sequenceEmails.$inferSelect> = async (id, updates) => {
    const result = await db()
        .update(sequenceEmails)
        .set({
            id,
            ...updates,
        })
        .where(eq(sequenceEmails.id, id))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating row');

    return result[0];
};

export const insertSequenceEmailsCall: (
    inserts: SequenceEmailInsert[],
) => Promise<typeof sequenceEmails.$inferSelect> = async (inserts) => {
    if (!inserts.every((insert) => insert.emailEngineAccountId)) {
        // This column was added later and is not 'not null', so add this check for any new ones
        throw new Error('Missing required email_engine_account_id');
    }
    const result = await db().insert(sequenceEmails).values(inserts).returning();

    if (result.length !== 1) throw new Error('Error in inserting row');

    return result[0];
};
