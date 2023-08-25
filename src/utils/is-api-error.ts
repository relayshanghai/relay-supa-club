import type { ApiError } from './api-handler';

export const isApiError = (value: any): value is ApiError => {
    return value?.error !== undefined;
};
