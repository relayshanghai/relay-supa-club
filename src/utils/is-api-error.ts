import { ZodError } from 'zod';
import type { ApiError } from './api-handler';
import { RelayError } from './api-handler';

export const isApiError = (value: any): value is ApiError => {
    return value?.error !== undefined;
};

export const isUnknownError = (value: any): value is unknown => {
    if (value instanceof RelayError) return false;
    if (value instanceof ZodError) return false;
    if (value instanceof Error) return false;

    return typeof value === 'object' && value !== null;
};
