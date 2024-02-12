import { eq } from 'drizzle-orm';
import { outreach_email_templates } from 'drizzle/schema';
import { db, type DBQuery } from 'src/utils/database';

export type OutreachEmailTemplate = typeof outreach_email_templates.$inferSelect;

export const getOutreachTemplateVariablesByTemplateIdCall: DBQuery<
    (outreachEmailTemplateId: string) => Promise<OutreachEmailTemplate[]>
> = (databaseInstance) => async (outreachEmailTemplateId) => {
    const result = await db(databaseInstance)
        .select()
        .from(outreach_email_templates)
        .where(eq(outreach_email_templates.id, outreachEmailTemplateId))
        .limit(1);

    return result;
};
