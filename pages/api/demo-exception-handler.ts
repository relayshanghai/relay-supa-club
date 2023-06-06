import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

type RelayErrorOptions = {
    shouldLog?: boolean;
    sendToSentry?: boolean;
};

class RelayError extends Error {
    readonly _httpCode: number;
    readonly _shouldLog: boolean;
    readonly _sendToSentry: boolean;

    constructor(msg: string, httpCode = httpCodes.INTERNAL_SERVER_ERROR, options?: RelayErrorOptions) {
        super(msg);
        this._httpCode = httpCode;
        this._shouldLog = options?.shouldLog || true; // log to server by default
        this._sendToSentry = options?.sendToSentry || process.env.NODE_ENV === 'development';
    }

    get httpCode() {
        return this._httpCode;
    }

    get shouldLog() {
        return this._shouldLog;
    }

    get sendToSentry() {
        return this._sendToSentry;
    }
}

const ApiExceptionHandler = <T = any>(fn: NextApiHandler<T>) => {
    return async (req: NextApiRequest, res: NextApiResponse<T | { error: string }>) => {
        try {
            await fn(req, res);
        } catch (error) {
            const e = {
                httpCode: httpCodes.INTERNAL_SERVER_ERROR,
                message: 'Unknown Error',
            };

            if (error instanceof Error) {
                e.message = error.message;
            }

            if (error instanceof RelayError) {
                e.httpCode = error.httpCode;
                e.message = error.message;

                if (error.shouldLog) serverLogger(error, 'error', error.sendToSentry);
            }

            if (typeof error === 'string') {
                e.message = error;
            }

            // Hide server errors if not in development
            if (e.httpCode >= 500 && process.env.NODE_ENV !== 'development') {
                e.message = 'Error occurred';
            }

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

const handler: NextApiHandler = async (_req, _res) => {
    throw new RelayError('boop');
};

export default ApiExceptionHandler(handler);
