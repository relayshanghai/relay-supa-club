import type { TemplateVariableRequest } from 'pages/api/outreach/variables/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import OutreachEmailTemplateVariableRepository from 'src/backend/database/sequence-email-template/sequence-email-template-variable-repository';
import { GlobalTemplateVariables } from './constants';
import awaitToError from 'src/utils/await-to-error';
import { ConflictError } from 'src/utils/error/http-error';

export default class TemplateVariablesService {
    static service: TemplateVariablesService = new TemplateVariablesService();
    static getService(): TemplateVariablesService {
        return TemplateVariablesService.service;
    }

    @CompanyIdRequired()
    async get() {
        const companyId = RequestContext.getContext().companyId as string;
        const templates = await OutreachEmailTemplateVariableRepository.getRepository().find({
            where: {
                company: { id: companyId },
            },
        });

        return [...templates, ...GlobalTemplateVariables];
    }

    @CompanyIdRequired()
    async update(id: string, update: TemplateVariableRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        await this.checkVariableExist(update.name);
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
        await this.checkVariableExist(request.name);
        return OutreachEmailTemplateVariableRepository.getRepository().save({
            category: request.category,
            name: request.name,
            company: { id: companyId },
        });
    }

    async checkVariableExist(name: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const isGlobalVariable = !!GlobalTemplateVariables.find((variable) => variable.name === name);
        const [err] = await awaitToError(
            OutreachEmailTemplateVariableRepository.getRepository().findOneOrFail({
                where: {
                    company: { id: companyId },
                    name,
                },
            }),
        );
        if (!err || isGlobalVariable) {
            throw new ConflictError('Variable already exists, please use another name');
        }
    }
}
