import type { NextApiHandler } from 'next';
import {
    outreachEmailTemplateUpsertSchema,
    type OutreachEmailTemplate,
    type OutreachEmailTemplateUpsert,
} from 'src/backend/database/outreach-email-templates';
import EmailTemplateService from 'src/backend/domain/templates/email-templates';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

export type OutreachEmailTemplateGetResponse = OutreachEmailTemplate[];

export type OutreachEmailTemplatePutRequestBody = OutreachEmailTemplateUpsert;

export type OutreachEmailTemplatePutResponse = OutreachEmailTemplate;

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

const putHandler: NextApiHandler = async (req, res) => {
    const templateId = String(req.query.templateId);
    const validated = outreachEmailTemplateUpsertSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const templateBody: OutreachEmailTemplatePutRequestBody = validated.data;

    const emailTemplateService = EmailTemplateService.getService();

    const getResult: OutreachEmailTemplateGetResponse = await emailTemplateService.getEmailTemplateByTemplateId(
        templateId,
    );
    if (getResult.length === 0) {
        return res.status(httpCodes.NOT_FOUND).json({ error: 'Template not found' });
    }

    const result: OutreachEmailTemplatePutResponse = await emailTemplateService.upsertEmailTemplate(
        templateId,
        templateBody,
    );
    return res.status(httpCodes.ACCEPTED).json(result);
};

export default ApiHandlerWithContext({ getHandler, putHandler });
