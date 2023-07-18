import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';

import { generateAuthLink } from 'src/utils/api/email-engine';
import type { GenerateAuthLinkRequestBody } from 'types/email-engine/authentication-form';

export type GetAuthLinkPostRequestBody = GenerateAuthLinkRequestBody;
export type GetAuthLinkPostResponseBody = { url: string };
const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body as GetAuthLinkPostRequestBody;

    const url = await generateAuthLink(body);
    const result: GetAuthLinkPostResponseBody = { url };
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({ postHandler });
