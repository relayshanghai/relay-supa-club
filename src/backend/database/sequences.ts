import { eq, inArray } from 'drizzle-orm';
import { sequences } from 'drizzle/schema';
import type { Sequence, SequenceInsert, SequenceUpdate } from 'src/utils/api/db';
import { db, type DBQuery } from 'src/utils/database';

export const getSequencesByCompanyIdCall: DBQuery<(companyId: string) => Promise<Sequence[] | undefined | null>> =
    (databaseInstance) => async (companyId) => {
        if (!companyId) return;
        const result = await db(databaseInstance).select().from(sequences).where(eq(sequences.company_id, companyId));

        return result;
    };

export const getSequenceByIdCall: DBQuery<(id: string) => Promise<Sequence | undefined | null>> =
    (databaseInstance) => async (id) => {
        const result = await db(databaseInstance).select().from(sequences).where(eq(sequences.id, id)).limit(1);

        return result[0];
    };

export const updateSequenceCall: DBQuery<
    (update: SequenceUpdate & { id: string }) => Promise<Sequence | undefined | null>
> = (databaseInstance) => async (update) => {
    update.updated_at = new Date().toISOString();
    const result = await db(databaseInstance)
        .update(sequences)
        .set(update)
        .where(eq(sequences.id, update.id))
        .returning();

    return result[0];
};

export const createSequenceCall: DBQuery<(insert: SequenceInsert) => Promise<Sequence | undefined | null>> =
    (databaseInstance) => async (insert) => {
        const result = await db(databaseInstance).insert(sequences).values(insert).returning();

        return result[0];
    };

export const deleteSequenceCall: DBQuery<(ids: string[]) => Promise<void>> = (databaseInstance) => async (ids) => {
    await db(databaseInstance).update(sequences).set({ deleted: true }).where(inArray(sequences.id, ids));
};
