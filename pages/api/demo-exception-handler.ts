import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

type RelayErrorOptions = {
    shouldLog?: boolean;
};

class RelayError extends Error {
    private _httpCode: number;
    private _shouldLog: boolean;

    constructor(msg: string, httpCode: number = httpCodes.INTERNAL_SERVER_ERROR, options?: RelayErrorOptions) {
        super(msg);
        this._httpCode = httpCode;
        this._shouldLog = options?.shouldLog || true; // log to server by default
    }

    get httpCode() {
        return this._httpCode;
    }

    get shouldLog() {
        return this._shouldLog;
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
            const e = {
                httpCode: httpCodes.INTERNAL_SERVER_ERROR,
                message: 'Unknown Error',
            };

            if (isRelayError(error)) {
                e.httpCode = error.httpCode;
                e.message = error.message;

                if (error.shouldLog) serverLogger(error);
            }

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

const handler: NextApiHandler = async (_req, _res) => {
    throw new RelayError('boop');
};

export default ApiExceptionHandler(handler);
