import {
    type OutreachEmailTemplateUpsert,
    getOutreachEmailTemplateByTemplateIdCall,
    upsertEmailTemplateCall,
} from 'src/backend/database/outreach-email-templates';
import { updateTemplateInfo } from 'src/utils/api/email-engine';
import type { EmailTemplatePut } from 'types/email-engine/account-account-message-put';

export default class EmailTemplateService {
    static service: EmailTemplateService = new EmailTemplateService();
    static getService(): EmailTemplateService {
        return EmailTemplateService.service;
    }

    async getEmailTemplateByTemplateId(templateId: string) {
        return await getOutreachEmailTemplateByTemplateIdCall()(templateId);
    }

    async upsertEmailTemplate(templateId: string, templateBody: OutreachEmailTemplateUpsert) {
        const emailEngineUpdateBody: EmailTemplatePut = {
            name: templateBody.step,
            format: 'html',
            description: '',
            content: {
                subject: templateBody.subject || '',
                html: templateBody.template || '',
            },
        };

        await updateTemplateInfo(emailEngineUpdateBody, templateId || templateBody.email_engine_template_id);
        return await upsertEmailTemplateCall()(templateBody);
    }
}
