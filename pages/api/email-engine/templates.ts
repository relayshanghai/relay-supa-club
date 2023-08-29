import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getTemplateInfo } from 'src/utils/api/email-engine';

import type { TemplatesTemplateGetResponse } from 'types/email-engine/templates-template-get';

export type TemplatesPostRequestBody = {
    templateIds: string[];
};
export type TemplatesPostResponseBody = TemplatesTemplateGetResponse[];

const postHandler: NextApiHandler = async (req, res) => {
    const { templateIds } = req.body as TemplatesPostRequestBody;

    const result: TemplatesPostResponseBody = await Promise.all(
        templateIds.map(async (templateId) => {
            return await getTemplateInfo(templateId);
        }),
    );
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
