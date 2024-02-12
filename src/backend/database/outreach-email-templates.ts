import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { outreach_email_templates } from 'drizzle/schema';
import { db, type DBQuery } from 'src/utils/database';

export type OutreachEmailTemplate = typeof outreach_email_templates.$inferSelect;

export const outreachEmailTemplateUpsertSchema = createInsertSchema(outreach_email_templates);

export type OutreachEmailTemplateUpsert = typeof outreachEmailTemplateUpsertSchema._type;

export const getOutreachEmailTemplateByTemplateIdCall: DBQuery<
    (outreachEmailTemplateId: string) => Promise<OutreachEmailTemplate[]>
> = (databaseInstance) => async (outreachEmailTemplateId) => {
    const result = await db(databaseInstance)
        .select()
        .from(outreach_email_templates)
        .where(eq(outreach_email_templates.id, outreachEmailTemplateId))
        .limit(1);

    return result;
};

export const upsertEmailTemplateCall: DBQuery<
    (update: OutreachEmailTemplateUpsert) => Promise<OutreachEmailTemplate>
> = (databaseInstance) => async (update) => {
    const result = await db(databaseInstance)
        .insert(outreach_email_templates)
        .values(update)
        .onConflictDoUpdate({
            target: outreach_email_templates.id,
            set: update,
        })
        .returning();

    if (result.length !== 1) throw new Error('Error in updating outreachTemplateVariable row');

    return result[0];
};
