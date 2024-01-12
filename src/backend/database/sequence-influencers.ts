import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { sequence_influencers } from 'drizzle/schema';
import { db } from 'src/utils/database';
import { z } from 'zod';

export type SequenceInfluencer = typeof sequence_influencers.$inferSelect;

export const sequenceInfluencersInsertSchema = createInsertSchema(sequence_influencers);
export type SequenceInfluencersInsert = z.infer<typeof sequenceInfluencersInsertSchema>;

export const sequenceInfluencersUpdateSchema = sequenceInfluencersInsertSchema.partial().extend({
    id: z.string().uuid(),
    // for some reason the aut generated type for this doesn't work
    tags: z.array(z.string()).optional(),
});
export type SequenceInfluencersUpdate = z.infer<typeof sequenceInfluencersUpdateSchema>;

export const updateSequenceInfluencerCall = async (update: SequenceInfluencersUpdate): Promise<SequenceInfluencer> => {
    const result = await db()
        .update(sequence_influencers)
        .set(update)
        .where(eq(sequence_influencers.id, update.id))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating row');

    return result[0];
};
