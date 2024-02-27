import { validate, type ValidationError as VError } from 'class-validator';
import { HttpError } from '../error/http-error';
import httpCodes from 'src/constants/httpCodes';

const buildKey = (root: string, key: string) => {
    if (isNaN(parseInt(key))) {
        key = `${root || ''}.${key}`;
    } else {
        key = `${root || ''}[${key}]`;
    }
    return key;
};
const buildErrorMessage = (errors: VError[], key?: string): string[] => {
    return errors
        .map((error) => {
            let errs: string[] = [];
            if (error.constraints) {
                errs = Object.values(error.constraints).map((message) => `${key ?? ''}.${message}`);
            }

            if (error.children) {
                errs = [...errs, ...buildErrorMessage(error.children, buildKey(key as string, error.property)).flat()];
            }
            return errs;
        })
        .flat();
};

export class ValidationError extends HttpError {
    messages: string[];
    constructor(messages: string[]) {
        super('Validation failed!', httpCodes.BAD_REQUEST);
        this.name = ValidationError.name;
        this.messages = messages;
    }
}

export const validateRequest = async <T>(request: T) => {
    const errors = await validate(request as object);
    if (errors.length > 0) {
        throw new ValidationError(buildErrorMessage(errors));
    }
};
