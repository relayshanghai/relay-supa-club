import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dbCalls from '../../database/outreach-email-templates';
import EmailTemplateService from './email-templates';
import { upsertEmailTemplateCall } from '../../database/outreach-email-templates';
const templateId = 'template_1';

describe('src/backend/domain/templates/email-templates.test.ts', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    describe('.getOutreachEmailTemplateByTemplateIdCall()', () => {
        it('calls correct db helper with correct parameters to get email template by template io', () => {
            const getOutreachEmailTemplatesByTemplateIdCallMock = vi.fn();
            vi.spyOn(dbCalls, 'getOutreachEmailTemplateByTemplateIdCall').mockImplementation(
                () => getOutreachEmailTemplatesByTemplateIdCallMock,
            );
            const emailTemplateService = new EmailTemplateService();
            emailTemplateService.getEmailTemplateByTemplateId(templateId);
            expect(getOutreachEmailTemplatesByTemplateIdCallMock).toHaveBeenCalledWith(templateId);
        });
    });
    describe('.upsertEmailTemplateCall()', () => {
        it('calls correct db helper with correct parameters to upsert email template in database', async () => {
            const upsertOutreachEmailTemplateCallMock = vi.fn();
            vi.spyOn(dbCalls, 'upsertEmailTemplateCall').mockImplementation(() => upsertOutreachEmailTemplateCallMock);
            const update: dbCalls.OutreachEmailTemplateUpsert = {
                company_id: 'companyId',
                id: 'uuid1',
                step: 'OUTREACH',
                email_engine_template_id: 'AAAbCD',
                subject: 'Email Subject Sample',
                template: '<p>Hello</p>',
            };
            await upsertEmailTemplateCall()(update);
            expect(upsertOutreachEmailTemplateCallMock).toHaveBeenCalledWith(update);
        });
    });
});
