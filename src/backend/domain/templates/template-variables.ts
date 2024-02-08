import { RequestContext } from 'src/utils/request-context/request-context';
import type {
    OutreachTemplateVariablesInsert,
    OutreachTemplateVariablesUpdate,
} from '../../database/outreach-template-variables';
import {
    getOutreachTemplateVariablesByCompanyIdCall,
    insertOutreachTemplateVariableCall,
    updateOutreachTemplateVariableCall,
} from '../../database/outreach-template-variables';

export default class TemplateVariablesService {
    static service: TemplateVariablesService = new TemplateVariablesService();
    static getService(): TemplateVariablesService {
        return TemplateVariablesService.service;
    }

    async getTemplateVariablesByCompanyId() {
        const companyId = RequestContext.getContext().companyId;
        if (!companyId) {
            throw new Error('No company id found in request context');
        }
        return await getOutreachTemplateVariablesByCompanyIdCall()(companyId);
    }

    async updateTemplateVariable(update: OutreachTemplateVariablesUpdate) {
        return await updateOutreachTemplateVariableCall()(update);
    }

    async insertTemplateVariable(insert: OutreachTemplateVariablesInsert) {
        return await insertOutreachTemplateVariableCall()(insert);
    }
}
