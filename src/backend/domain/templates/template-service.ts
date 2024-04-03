import type {
    GetTemplateRequest,
    OutreachStepRequest,
    TemplateRequest,
} from 'pages/api/outreach/email-templates/request';
import type { GetAllTemplateResponse, GetTemplateResponse } from 'pages/api/outreach/email-templates/response';
import OutreachTemplateRepository from 'src/backend/database/outreach-template-repository';
import EmailEngineService from 'src/backend/integration/email-engine/email-engine';
import { RequestContext } from 'src/utils/request-context/request-context';
import { CompanyIdRequired } from '../decorators/company-id';
import OutreachTemplateVariableRepository from 'src/backend/database/outreach-template-variable-repository';
import { NotFoundError } from 'src/utils/error/http-error';

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
        const created = await OutreachTemplateRepository.getRepository().create({
            company_id: companyId,
            description: template.description,
            email_engine_template_id: emailEngineId,
            step: template.step,
            subject: template.subject,
            template: template.template,
            name: template.name,
            variableIds: template.variableIds,
        });
        return created;
    }

    @CompanyIdRequired()
    async update(id: string, template: TemplateRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const existed = await OutreachTemplateRepository.getRepository().get(companyId, id);
        await this.checkVariableExists(template.variableIds);
        await EmailEngineService.getService().updateTemplate(existed.email_engine_template_id, {
            html: template.template,
            name: template.step,
            subject: template.subject,
        });
        await OutreachTemplateRepository.getRepository().update(id, {
            name: template.name,
            description: template.description,
            company_id: companyId,
            email_engine_template_id: existed.email_engine_template_id,
            step: template.step,
            subject: template.subject,
            template: template.template,
            variableIds: template.variableIds.map((id) => id),
        });
    }

    @CompanyIdRequired()
    async getAll(param: GetTemplateRequest): Promise<GetAllTemplateResponse[]> {
        const companyId = RequestContext.getContext().companyId as string;
        const data = await OutreachTemplateRepository.getRepository().getAll(companyId, param.step);
        return data.map((template) => ({
            name: template.name as string,
            description: template.description as string,
            id: template.id,
            step: template.step as OutreachStepRequest,
        }));
    }

    @CompanyIdRequired()
    async getOne(id: string): Promise<GetTemplateResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const data = await OutreachTemplateRepository.getRepository().get(companyId, id);
        return {
            name: data.name,
            description: data.description as string,
            id: data.id,
            step: data.step.toString(),
            subject: data.subject as string,
            template: data.template as string,
            variables: data.variables.map((variable) => ({
                category: variable.outreach_template_variables.category,
                id: variable.outreach_template_variables.id,
                name: variable.outreach_template_variables.name,
            })),
        };
    }
    @CompanyIdRequired()
    async delete(id: string): Promise<void> {
        const companyId = RequestContext.getContext().companyId as string;
        await OutreachTemplateRepository.getRepository().get(companyId, id);
        await OutreachTemplateRepository.getRepository().delete(companyId, id);
    }
}
