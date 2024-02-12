import { getOutreachTemplateVariablesByTemplateIdCall } from 'src/backend/database/outreach-email-templates';

export default class EmailTemplateService {
    static service: EmailTemplateService = new EmailTemplateService();
    static getService(): EmailTemplateService {
        return EmailTemplateService.service;
    }

    async getEmailTemplateByTemplateId(templateId: string) {
        return await getOutreachTemplateVariablesByTemplateIdCall()(templateId);
    }
}
