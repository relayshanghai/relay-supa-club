export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const METHOD_NOT_ALLOWED = 405;
export const PRECONDITION_FAILED = 412;
export const RATE_LIMIT_EXCEEDED = 429;
export const INTERNAL_SERVER_ERROR = 500;
export const NOT_IMPLEMENTED = 501;
export const CONFLICT = 409;

const httpCodes = {
    OK,
    CREATED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    PRECONDITION_FAILED,
    RATE_LIMIT_EXCEEDED,
    INTERNAL_SERVER_ERROR,
    NOT_IMPLEMENTED,
    CONFLICT,
};

export default httpCodes;
