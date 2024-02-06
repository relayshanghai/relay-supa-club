import { eq, inArray } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { template_variables, sequences } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';

import { z } from 'zod';

export type TemplateVariable = typeof template_variables.$inferSelect;

export const templateVariablesGet = z.object({
    query: z.object({
        companyId: z.string().uuid(),
    }),
});

export type TemplateVariablesGet = z.infer<typeof templateVariablesGet>;

export const templateVariablesInsertSchema = createInsertSchema(template_variables);
export type TemplateVariablesInsert = typeof templateVariablesInsertSchema._type;

export const templateVariablesUpdateSchema = templateVariablesInsertSchema.partial().extend({ id: z.string().uuid() });
export type TemplateVariablesUpdate = z.infer<typeof templateVariablesUpdateSchema>;

export const insertTemplateVariableCall: DBQuery<
    (templateVariable: TemplateVariablesInsert) => Promise<TemplateVariable>
> = (databaseInstance) => async (templateVariable) => {
    const result = await db(databaseInstance).insert(template_variables).values(templateVariable).returning();

    if (result.length !== 1) throw new Error('Error in inserting templateVariable row');

    return result[0];
};

export const updateTemplateVariableCall: DBQuery<(update: TemplateVariablesUpdate) => Promise<TemplateVariable>> =
    (databaseInstance) => async (update) => {
        const result = await db(databaseInstance)
            .update(template_variables)
            .set(update)
            .where(eq(template_variables.id, update.id))
            .returning();

        if (result.length !== 1) throw new Error('Error in updating templateVariable row');

        return result[0];
    };

export const getTemplateVariableCall: DBQuery<(templateVariableId: string) => Promise<TemplateVariable>> =
    (databaseInstance) => async (templateVariableId) => {
        const result = await db(databaseInstance)
            .select()
            .from(template_variables)
            .where(eq(template_variables.id, templateVariableId));

        if (result.length !== 1) throw new Error('Error in getting templateVariable row');

        return result[0];
    };

export const getTemplateVariablesBySequenceIdsCall: DBQuery<(sequenceIds: string[]) => Promise<TemplateVariable[]>> =
    (databaseInstance) => async (sequenceIds) => {
        const result = await db(databaseInstance)
            .select()
            .from(template_variables)
            .where(inArray(template_variables.sequence_id, sequenceIds));

        return result;
    };

export const getTemplateVariablesByCompanyIdCall: DBQuery<(companyId: string) => Promise<TemplateVariable[]>> =
    (databaseInstance) => async (companyId) => {
        // company_id does not exist on the table so we need to get all sequences ids and then get all template variables for those sequences

        const sequencesSelect = (
            await db(databaseInstance)
                .select({ id: sequences.id })
                .from(sequences)
                .where(eq(sequences.company_id, companyId))
        ).map((sequence) => sequence.id);

        const result = await getTemplateVariablesBySequenceIdsCall(databaseInstance)(sequencesSelect);

        return result;
    };
