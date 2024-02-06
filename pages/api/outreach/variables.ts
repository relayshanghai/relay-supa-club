import type { NextApiHandler } from 'next';
import type {
    OutreachTemplateVariable,
    OutreachTemplateVariablesUpdate,
    OutreachTemplateVariablesGet,
    OutreachTemplateVariablesInsert,
} from 'src/backend/database/outreach-template-variables';
import {
    outreachTemplateVariablesUpdateSchema,
    updateOutreachTemplateVariableCall,
    outreachTemplateVariablesGet,
    outreachTemplateVariablesInsertSchema,
    insertOutreachTemplateVariableCall,
    getOutreachTemplateVariablesByCompanyIdCall,
} from 'src/backend/database/outreach-template-variables';

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
    const result: OutreachTemplateVariablesGetResponse = await getOutreachTemplateVariablesByCompanyIdCall()(
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
    const result: OutreachTemplateVariablesPutResponse = await updateOutreachTemplateVariableCall()(update);
    return res.status(httpCodes.OK).json(result);
};

const postHandler: NextApiHandler = async (req, res) => {
    const validated = outreachTemplateVariablesInsertSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const insert: OutreachTemplateVariablesPostRequestBody = validated.data;
    const result: OutreachTemplateVariable = await insertOutreachTemplateVariableCall()(insert);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandlerWithContext({ getHandler, putHandler, postHandler });
