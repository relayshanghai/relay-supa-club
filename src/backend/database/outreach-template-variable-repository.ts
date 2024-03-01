import type { SQL } from 'drizzle-orm';
import { and, eq, inArray } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { outreach_template_variables } from 'drizzle/schema';
import awaitToError from 'src/utils/await-to-error';
import { db } from 'src/utils/database';
import { BadRequestError, ConflictError, NotFoundError } from 'src/utils/error/http-error';

export const outreachTemplateVariableInsertSchema = createInsertSchema(outreach_template_variables);
export type OutreachTemplateVariableInsert = typeof outreachTemplateVariableInsertSchema._type;

export const outreachTemplateVariablesUpdateSchema = outreachTemplateVariableInsertSchema.partial();

export type OutreachTemplateVariablesUpdate = typeof outreachTemplateVariablesUpdateSchema._type;

export default class OutreachTemplateVariableRepository {
    static repository: OutreachTemplateVariableRepository = new OutreachTemplateVariableRepository();
    static getRepository(): OutreachTemplateVariableRepository {
        return OutreachTemplateVariableRepository.repository;
    }

    async create(companyId: string, outreachTemplate: Omit<OutreachTemplateVariableInsert, 'company_id'>) {
        const [err, inserted] = await awaitToError(
            db()
                .insert(outreach_template_variables)
                .values({
                    ...outreachTemplate,
                    company_id: companyId,
                })
                .returning(),
        );
        if (err) {
            if (err.message.includes('duplicate')) {
                throw new ConflictError(`Variable with name: ${outreachTemplate.name} already exists`);
            }
            throw err;
        }
        return inserted[0];
    }
    async update(id: string, outreachTemplate: OutreachTemplateVariablesUpdate) {
        return await db()
            .update(outreach_template_variables)
            .set({
                ...outreachTemplate,
            })
            .where(eq(outreach_template_variables.id, id));
    }
    async delete(id: string) {
        const [err] = await awaitToError(
            db().delete(outreach_template_variables).where(eq(outreach_template_variables.id, id)),
        );
        if (err) {
            if (err.message.includes('violates foreign key constraint')) {
                throw new BadRequestError('This variable is being used in a template');
            }
            throw err;
        }
    }

    async getAll(companyId: string, ...ids: string[]) {
        let where: SQL = eq(outreach_template_variables.company_id, companyId);
        if (ids.length > 0) {
            where = and(where, inArray(outreach_template_variables.id, ids)) as SQL;
        }
        const data = await db().select().from(outreach_template_variables).where(where);
        return data;
    }

    async getOne(companyId: string, id: string) {
        const [data] = await db()
            .select()
            .from(outreach_template_variables)
            .where(and(eq(outreach_template_variables.id, id), eq(outreach_template_variables.company_id, companyId)));
        if (!data) {
            throw new NotFoundError(`template variables with id: ${id} and company id: ${companyId} does not exist`);
        }
        return data;
    }
}
