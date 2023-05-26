import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';

export type ApiHandlerParams = {
    getHandler?: NextApiHandler;
    postHandler?: NextApiHandler;
    deleteHandler?: NextApiHandler;
};

export const ApiHandler = (params: ApiHandlerParams) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET' && params.getHandler !== undefined) {
        return await params.getHandler(req, res);
    }

    if (req.method === 'POST' && params.postHandler !== undefined) {
        return await params.postHandler(req, res);
    }

    if (req.method === 'DELETE' && params.deleteHandler !== undefined) {
        return await params.deleteHandler(req, res);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
        error: 'Method not allowed',
    });
};
