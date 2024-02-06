import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { outreach_template_variables } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';

import { z } from 'zod';

export type OutreachTemplateVariable = typeof outreach_template_variables.$inferSelect;

export const outreachTemplateVariablesGet = z.object({
    query: z.object({
        companyId: z.string().uuid(),
    }),
});

export type OutreachTemplateVariablesGet = z.infer<typeof outreachTemplateVariablesGet>;

export const outreachTemplateVariablesInsertSchema = createInsertSchema(outreach_template_variables);
export type OutreachTemplateVariablesInsert = typeof outreachTemplateVariablesInsertSchema._type;

export const outreachTemplateVariablesUpdateSchema = outreachTemplateVariablesInsertSchema
    .partial()
    .extend({ id: z.string().uuid() });
export type OutreachTemplateVariablesUpdate = z.infer<typeof outreachTemplateVariablesUpdateSchema>;

export const insertOutreachTemplateVariableCall: DBQuery<
    (outreachTemplateVariable: OutreachTemplateVariablesInsert) => Promise<OutreachTemplateVariable>
> = (databaseInstance) => async (outreachTemplateVariable) => {
    const result = await db(databaseInstance)
        .insert(outreach_template_variables)
        .values(outreachTemplateVariable)
        .returning();

    if (result.length !== 1) throw new Error('Error in inserting outreachTemplateVariable row');

    return result[0];
};

export const updateOutreachTemplateVariableCall: DBQuery<
    (update: OutreachTemplateVariablesUpdate) => Promise<OutreachTemplateVariable>
> = (databaseInstance) => async (update) => {
    const result = await db(databaseInstance)
        .update(outreach_template_variables)
        .set(update)
        .where(eq(outreach_template_variables.id, update.id))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating outreachTemplateVariable row');

    return result[0];
};

export const getOutreachTemplateVariableCall: DBQuery<
    (outreachTemplateVariableId: string) => Promise<OutreachTemplateVariable>
> = (databaseInstance) => async (outreachTemplateVariableId) => {
    const result = await db(databaseInstance)
        .select()
        .from(outreach_template_variables)
        .where(eq(outreach_template_variables.id, outreachTemplateVariableId));

    if (result.length !== 1) throw new Error('Error in getting outreachTemplateVariable row');

    return result[0];
};

export const getOutreachTemplateVariablesByCompanyIdCall: DBQuery<
    (companyId: string) => Promise<OutreachTemplateVariable[]>
> = (databaseInstance) => async (companyId) => {
    const result = await db(databaseInstance)
        .select()
        .from(outreach_template_variables)
        .where(eq(outreach_template_variables.company_id, companyId));

    return result;
};
