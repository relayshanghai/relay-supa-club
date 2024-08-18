import type { GetTemplateRequest, TemplateRequest } from 'pages/api/outreach/email-templates/request';
import type { GetAllTemplateResponse, GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import EmailEngineService from 'src/backend/integration/email-engine/email-engine';
import { RequestContext } from 'src/utils/request-context/request-context';
import { CompanyIdRequired } from '../decorators/company-id';
import OutreachTemplateVariableRepository from 'src/backend/database/outreach-template-variable-repository';
import { NotFoundError } from 'src/utils/error/http-error';
import OutreachEmailTemplateRepository from 'src/backend/database/sequence-email-template/sequence-email-template-repository';
import type { Step } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import awaitToError from 'src/utils/await-to-error';

export default class TemplateService {
    static readonly service: TemplateService = new TemplateService();
    static getService(): TemplateService {
        return TemplateService.service;
    }
    async checkVariableExists(variableIds: string[]) {
        const companyId = RequestContext.getContext().companyId as string;
        const existedVariables = await OutreachTemplateVariableRepository.getRepository().getAll(
            companyId,
            ...variableIds.map((id) => id),
        );
        variableIds.forEach((id) => {
            if (!existedVariables.find((variable) => variable.id === id)) {
                throw new NotFoundError(`variable with id: ${id} does not exist`);
            }
        });
    }
    @CompanyIdRequired()
    async create(template: TemplateRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        await this.checkVariableExists(template.variableIds);
        const emailEngineId = await EmailEngineService.getService().createTemplate({
            html: template.template,
            name: template.step,
            subject: template.subject,
        });
        const created = await OutreachEmailTemplateRepository.getRepository().save({
            company: { id: companyId },
            name: template.name,
            description: template.description,
            step: template.step as unknown as Step,
            subject: template.subject,
            template: template.template,
            email_engine_template_id: emailEngineId,
            variables: template.variableIds.map((id) => ({
                id,
            })),
        });
        return created;
    }

    @CompanyIdRequired()
    async update(id: string, template: TemplateRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, existed] = await awaitToError(
            OutreachEmailTemplateRepository.getRepository().findOneOrFail({
                where: {
                    company: { id: companyId },
                    id,
                },
            }),
        );
        if (err) throw new NotFoundError('not found');
        await this.checkVariableExists(template.variableIds);
        await EmailEngineService.getService().updateTemplate(existed.email_engine_template_id, {
            html: template.template,
            name: template.step,
            subject: template.subject,
        });
        await OutreachEmailTemplateRepository.getRepository().save({
            ...existed,
            name: template.name,
            description: template.description,
            company: { id: companyId },
            email_engine_template_id: existed.email_engine_template_id,
            step: template.step as unknown as Step,
            subject: template.subject,
            template: template.template,
            variables: template.variableIds.map((id) => ({
                id,
            })),
        });
    }

    @CompanyIdRequired()
    async getAll(param: GetTemplateRequest): Promise<GetAllTemplateResponse[]> {
        const companyId = RequestContext.getContext().companyId as string;
        const data = await OutreachEmailTemplateRepository.getRepository().find({
            where: {
                company: { id: companyId },
                step: param.step as unknown as Step,
            },
        });
        return data.map((template) => ({
            name: template.name as string,
            description: template.description as string,
            id: template.id,
            step: template.step,
        }));
    }

    @CompanyIdRequired()
    async getOne(id: string): Promise<GetTemplateResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, data] = await awaitToError(
            OutreachEmailTemplateRepository.getRepository().findOneOrFail({
                where: {
                    company: { id: companyId },
                    id,
                },
                relations: { variables: true },
            }),
        );
        if (err) throw new NotFoundError('not found');
        return {
            name: data.name,
            description: data.description as string,
            id: data.id,
            step: data.step.toString(),
            subject: data.subject as string,
            template: data.template as string,
            emailEngineTemplateId: data.email_engine_template_id,
            variables: data.variables
                ? data.variables.map((variable) => ({
                      id: variable.id,
                      name: variable.name,
                      category: variable.category,
                  }))
                : [],
        };
    }
    @CompanyIdRequired()
    async delete(id: string): Promise<void> {
        const template = await this.getOne(id);
        await OutreachEmailTemplateRepository.getRepository().delete({ id });
        await EmailEngineService.getService().deleteTemplate(template.emailEngineTemplateId as string);
    }
}
