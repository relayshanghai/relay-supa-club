import type { NextApiHandler } from 'next';
import type {
    TemplateVariable,
    TemplateVariablesUpdate,
    TemplateVariablesGet,
    TemplateVariablesInsert,
} from 'src/backend/database/template-variables';
import {
    templateVariablesUpdateSchema,
    updateTemplateVariableCall,
    templateVariablesGet,
    templateVariablesInsertSchema,
    insertTemplateVariableCall,
    getTemplateVariablesByCompanyIdCall,
} from 'src/backend/database/template-variables';

import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

export type TemplateVariableGetQuery = TemplateVariablesGet;
export type TemplateVariablesGetResponse = TemplateVariable[];

export type TemplateVariablesPutRequestBody = TemplateVariablesUpdate;
export type TemplateVariablesPutResponse = TemplateVariable;

export type TemplateVariablesPostRequestBody = TemplateVariablesInsert;
export type TemplateVariablesPostResponse = TemplateVariable;

const getHandler: NextApiHandler = async (req, res) => {
    const validated = templateVariablesGet.safeParse(req);

    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const query: TemplateVariableGetQuery['query'] = validated.data.query;
    const result: TemplateVariablesGetResponse = await getTemplateVariablesByCompanyIdCall()(query.companyId);
    return res.status(httpCodes.OK).json(result);
};

const putHandler: NextApiHandler = async (req, res) => {
    const validated = templateVariablesUpdateSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const update: TemplateVariablesPutRequestBody = validated.data;
    const result: TemplateVariablesPutResponse = await updateTemplateVariableCall()(update);
    return res.status(httpCodes.OK).json(result);
};

const postHandler: NextApiHandler = async (req, res) => {
    const validated = templateVariablesInsertSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const insert: TemplateVariablesPostRequestBody = validated.data;
    const result: TemplateVariable = await insertTemplateVariableCall()(insert);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandlerWithContext({ getHandler, putHandler, postHandler });
