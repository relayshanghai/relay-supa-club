import { ZodError } from 'zod';
import type { ApiError } from 'src/errors/api-error';
import { RelayError } from 'src/errors/relay-error';

export const isApiError = (value: any): value is ApiError => {
    return value?.error !== undefined;
};

export const isUnknownError = (value: any): value is unknown => {
    if (typeof value !== 'object') return false;
    if (value instanceof RelayError) return false;
    if (value instanceof ZodError) return false;
    if (value instanceof Error) return false;

    return typeof value === 'object' && value !== null;
};
