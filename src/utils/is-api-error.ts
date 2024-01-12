import { ZodError } from 'zod';
import type { ApiError } from 'src/errors/api-error';
import { RelayError } from 'src/errors/relay-error';

export const isApiError = (value: any): value is ApiError => {
    return value?.error !== undefined;
};

export const isUnknownError = (value: any): value is unknown => {
    // consider value is an unknown error if not an object
    if (typeof value !== 'object' || value === null) return true;
    if (value instanceof RelayError) return false;
    if (value instanceof ZodError) return false;
    if (value instanceof Error) return false;

    // Consider all other objects as "unknown errors"
    return typeof value === 'object' && value !== null;
};

export const isAbortError = (value: any): value is DOMException => {
    return value?.name === 'AbortError';
};
