import type { NextApiHandler } from 'next';
import type {
    OutreachTemplateVariable,
    OutreachTemplateVariablesUpdate,
    OutreachTemplateVariablesGet,
    OutreachTemplateVariablesInsert,
} from 'src/backend/database/outreach-template-variables';
import {
    outreachTemplateVariablesUpdateSchema,
    outreachTemplateVariablesGet,
    outreachTemplateVariablesInsertSchema,
} from 'src/backend/database/outreach-template-variables';
import TemplateVariablesService from 'src/backend/domain/templates/template-variables';

import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

export type OutreachTemplateVariableGetQuery = OutreachTemplateVariablesGet;
export type OutreachTemplateVariablesGetResponse = OutreachTemplateVariable[];

export type OutreachTemplateVariablesPutRequestBody = OutreachTemplateVariablesUpdate;
export type OutreachTemplateVariablesPutResponse = OutreachTemplateVariable;

export type OutreachTemplateVariablesPostRequestBody = OutreachTemplateVariablesInsert;
export type OutreachTemplateVariablesPostResponse = OutreachTemplateVariable;

const getHandler: NextApiHandler = async (req, res) => {
    const validated = outreachTemplateVariablesGet.safeParse(req);

    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const query: OutreachTemplateVariableGetQuery['query'] = validated.data.query;

    const templateVariablesService = TemplateVariablesService.getService();
    const result: OutreachTemplateVariablesGetResponse = await templateVariablesService.getTemplateVariablesByCompanyId(
        query.companyId,
    );
    return res.status(httpCodes.OK).json(result);
};

const putHandler: NextApiHandler = async (req, res) => {
    const validated = outreachTemplateVariablesUpdateSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const update: OutreachTemplateVariablesPutRequestBody = validated.data;

    const templateVariablesService = TemplateVariablesService.getService();

    const result: OutreachTemplateVariablesPutResponse = await templateVariablesService.updateTemplateVariable(update);
    return res.status(httpCodes.OK).json(result);
};

const postHandler: NextApiHandler = async (req, res) => {
    const validated = outreachTemplateVariablesInsertSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const insert: OutreachTemplateVariablesPostRequestBody = validated.data;
    const templateVariablesService = TemplateVariablesService.getService();

    const result: OutreachTemplateVariable = await templateVariablesService.insertTemplateVariable(insert);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandlerWithContext({ getHandler, putHandler, postHandler });
