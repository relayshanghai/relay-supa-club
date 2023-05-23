import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';

class RelayError extends Error {
    private _httpCode: number;

    constructor(msg: string, httpCode: number = httpCodes.INTERNAL_SERVER_ERROR) {
        super(msg);
        this._httpCode = httpCode;
    }

    get httpCode() {
        return this._httpCode;
    }
}

export function isRelayError(o: any): o is RelayError {
    return (o as RelayError).message !== undefined && (o as RelayError).httpCode !== undefined;
}

const ApiExceptionHandler = (fn: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await fn(req, res);
        } catch (error) {
            const e = isRelayError(error)
                ? {
                      httpCode: error.httpCode,
                      message: error.message,
                  }
                : {
                      httpCode: httpCodes.INTERNAL_SERVER_ERROR,
                      message: 'Unknown Error',
                  };

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

const handler: NextApiHandler = async (_req, _res) => {
    throw new RelayError('boop');
};

export default ApiExceptionHandler(handler);
