import httpCodes from 'src/constants/httpCodes';

/**
 * This object is defined as rest api error
 */
export class HttpError extends Error {
    /**
     *
     * @param message error message on returns to rest response
     * @param httpCode http status code
     * @param originError the original error will be logged in the logger
     */
    constructor(public message: string, public httpCode: number, public originError?: Error) {
        super(message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, originError?: Error) {
        super(message, httpCodes.BAD_REQUEST, originError);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, originError?: Error) {
        super(message, httpCodes.UNAUTHORIZED, originError);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string, originError?: Error) {
        super(message, httpCodes.NOT_FOUND, originError);
    }
}

export class PreconditionError extends HttpError {
    constructor(message: string, originError?: Error) {
        super(message, httpCodes.PRECONDITION_FAILED, originError);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string, originError?: Error) {
        super(message, httpCodes.CONFLICT, originError);
    }
}
