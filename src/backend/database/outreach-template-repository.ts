import type { SQL } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import {
    outreach_email_template_variables_relation,
    outreach_email_templates,
    outreach_template_variables,
} from 'drizzle/schema';
import type { OutreachStepRequest } from 'pages/api/outreach/email-templates/request';
import { db } from 'src/utils/database';
import { NotFoundError } from 'src/utils/error/http-error';

export const outreachTemplateVariableRelationSchema = createInsertSchema(outreach_email_template_variables_relation);

export type OutreachTemplateVariableRelation = typeof outreachTemplateVariableRelationSchema._type;

export const outreachTemplateInsertSchema = createInsertSchema(outreach_email_templates);

export type OutreachTemplateInsert = typeof outreachTemplateInsertSchema._type & { variableIds: string[] };

export default class OutreachTemplateRepository {
    static repository: OutreachTemplateRepository = new OutreachTemplateRepository();
    static getRepository(): OutreachTemplateRepository {
        return OutreachTemplateRepository.repository;
    }

    async create(outreachTemplate: OutreachTemplateInsert) {
        const [inserted] = await db().insert(outreach_email_templates).values(outreachTemplate).returning();
        if (outreachTemplate.variableIds && outreachTemplate.variableIds.length > 0) {
            await db()
                .insert(outreach_email_template_variables_relation)
                .values(
                    outreachTemplate.variableIds.map((id) => ({
                        outreach_email_template_id: inserted.id,
                        outreach_template_variable_id: id,
                    })),
                );
        }
        return inserted;
    }
    async update(id: string, outreachTemplate: OutreachTemplateInsert) {
        return await db()
            .update(outreach_email_templates)
            .set(outreachTemplate)
            .where(eq(outreach_email_templates.id, id));
    }
    async getVariables(id: string) {
        const data = await db()
            .select()
            .from(outreach_template_variables)
            .innerJoin(
                outreach_email_template_variables_relation,
                eq(
                    outreach_template_variables.id,
                    outreach_email_template_variables_relation.outreach_template_variable_id,
                ),
            )
            .where(eq(outreach_email_templates.id, id));
        return data;
    }
    async get(companyId: string, id: string) {
        const [data] = await db()
            .select()
            .from(outreach_email_templates)
            .where(and(eq(outreach_email_templates.id, id), eq(outreach_email_templates.company_id, companyId)));
        if (!data) {
            throw new NotFoundError(`template with id: ${id} and company id: ${companyId} does not exist`);
        }
        const variables = await this.getVariables(id);
        return {
            ...data,
            variables,
        };
    }
    async delete(companyId: string, id: string) {
        await db()
            .delete(outreach_email_templates)
            .where(and(eq(outreach_email_templates.id, id), eq(outreach_email_templates.company_id, companyId)));
    }

    async getAll(companyId: string, step?: OutreachStepRequest) {
        let where: SQL = eq(outreach_email_templates.company_id, companyId);
        if (step) {
            where = and(where, eq(outreach_email_templates.step, step)) as SQL;
        }
        const data = await db().select().from(outreach_email_templates).where(where);
        return data;
    }
}
