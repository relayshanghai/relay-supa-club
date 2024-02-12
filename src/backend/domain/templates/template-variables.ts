
import type { TemplateVariableRequest } from 'pages/api/outreach/variables/request';
import { CompanyIdRequired } from '../decorators/company-id';
import OutreachTemplateVariableRepository from 'src/backend/database/outreach-template-variable-repository';
import { RequestContext } from 'src/utils/request-context/request-context';

export default class TemplateVariablesService {
    static service: TemplateVariablesService = new TemplateVariablesService();
    static getService(): TemplateVariablesService {
        return TemplateVariablesService.service;
    }

    @CompanyIdRequired()
    async get() {
        const companyId = RequestContext.getContext().companyId as string;
        return await OutreachTemplateVariableRepository.getRepository().getAll(companyId);
    }

    @CompanyIdRequired()
    async update(id: string, update: TemplateVariableRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        await OutreachTemplateVariableRepository.getRepository().getOne(companyId, id);
        return await OutreachTemplateVariableRepository.getRepository().update(companyId, id, {
            category: update.category,
            name: update.name,
        });
    }

    @CompanyIdRequired()
    async delete(id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        return await OutreachTemplateVariableRepository.getRepository().delete(id);
    }

    @CompanyIdRequired()
    async create(request: TemplateVariableRequest) {
        return await OutreachTemplateVariableRepository.getRepository().create(request);
    }
}
