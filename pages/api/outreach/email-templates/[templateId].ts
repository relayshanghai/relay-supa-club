import type { NextApiHandler } from 'next';
import { type OutreachEmailTemplate } from 'src/backend/database/outreach-email-templates';
import EmailTemplateService from 'src/backend/domain/templates/email-templates';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

export type OutreachEmailTemplateGetResponse = OutreachEmailTemplate[];

const getHandler: NextApiHandler = async (req, res) => {
    const templateId = String(req.query.templateId);

    const emailTemplateService = EmailTemplateService.getService();

    const result: OutreachEmailTemplateGetResponse = await emailTemplateService.getEmailTemplateByTemplateId(
        templateId,
    );
    if (result.length === 0) {
        return res.status(httpCodes.NOT_FOUND).json({ error: 'Template not found' });
    }
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandlerWithContext({ getHandler });
