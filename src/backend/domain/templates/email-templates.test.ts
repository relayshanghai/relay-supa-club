import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dbCalls from '../../database/outreach-email-templates';
import EmailTemplateService from './email-templates';
const templateId = 'template_1';

describe('src/backend/domain/templates/email-templates.test.ts', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    describe('.getTemplateVariablesByCompanyId()', () => {
        it('calls correct db helper with correct parameters to get email template by template io', () => {
            const getOutreachTemplateVariablesByTemplateIdCallMock = vi.fn();
            vi.spyOn(dbCalls, 'getOutreachTemplateVariablesByTemplateIdCall').mockImplementation(
                () => getOutreachTemplateVariablesByTemplateIdCallMock,
            );
            const emailTemplateService = new EmailTemplateService();
            emailTemplateService.getEmailTemplateByTemplateId(templateId);
            expect(getOutreachTemplateVariablesByTemplateIdCallMock).toHaveBeenCalledWith(templateId);
        });
    });
});
