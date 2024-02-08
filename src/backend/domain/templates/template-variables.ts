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

    async getTemplateVariablesByCompanyId(companyId: string) {
        return await getOutreachTemplateVariablesByCompanyIdCall()(companyId);
    }

    async updateTemplateVariable(update: OutreachTemplateVariablesUpdate) {
        return await updateOutreachTemplateVariableCall()(update);
    }

    async insertTemplateVariable(insert: OutreachTemplateVariablesInsert) {
        return await insertOutreachTemplateVariableCall()(insert);
    }
}
