import { sequenceEmails } from 'drizzle/schema';
import { db } from 'src/utils/database';
import { eq } from 'drizzle-orm';
import type { SequenceEmailUpdate } from './types';

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
