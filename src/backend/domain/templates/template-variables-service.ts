import type { TemplateVariableRequest } from 'pages/api/outreach/variables/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import OutreachEmailTemplateVariableRepository from 'src/backend/database/sequence-email-template/sequence-email-template-variable-repository';

export default class TemplateVariablesService {
    static service: TemplateVariablesService = new TemplateVariablesService();
    static getService(): TemplateVariablesService {
        return TemplateVariablesService.service;
    }

    @CompanyIdRequired()
    async get() {
        const companyId = RequestContext.getContext().companyId as string;
        return OutreachEmailTemplateVariableRepository.getRepository().find({
            where: {
                company: { id: companyId },
            },
        });
    }

    @CompanyIdRequired()
    async update(id: string, update: TemplateVariableRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const outreachTemplateVariable = await OutreachEmailTemplateVariableRepository.getRepository().findOneOrFail({
            where: {
                company: { id: companyId },
                id,
            },
        });
        return OutreachEmailTemplateVariableRepository.getRepository().update(outreachTemplateVariable, {
            category: update.category,
            name: update.name,
        });
    }

    @CompanyIdRequired()
    async delete(id: string) {
        return OutreachEmailTemplateVariableRepository.getRepository().delete(id);
    }

    @CompanyIdRequired()
    async create(request: TemplateVariableRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        return OutreachEmailTemplateVariableRepository.getRepository().save({
            category: request.category,
            name: request.name,
            company: { id: companyId },
        });
    }
}
