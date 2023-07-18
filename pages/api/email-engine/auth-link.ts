import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { GenerateAuthLinkRequestBody } from 'src/utils/api/email-engine';
import { generateAuthLink } from 'src/utils/api/email-engine';
import { serverLogger } from 'src/utils/logger-server';

export type GetAuthLinkPostRequestBody = GenerateAuthLinkRequestBody;
export type GetAuthLinkPostResponseBody = { url: string };
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body as GetAuthLinkPostRequestBody;
    try {
        const url = await generateAuthLink(body);
        const result: GetAuthLinkPostResponseBody = { url };
        return res.status(httpCodes.OK).json(result);
    } catch (error: any) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            error: error?.message || 'Internal server error',
        });
    }
};

export default ApiHandler({
    postHandler,
});
