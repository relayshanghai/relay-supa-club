import { apiFetch as baseApiFetch } from 'src/utils/api/api-fetch';

const EMAIL_ENGINE_API_URL = (process.env.EMAIL_ENGINE_API_URL ?? 'http://localhost:4000') + '/v1';

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;

export const apiFetch: typeof baseApiFetch = (url, payload, options = {}) => {
    return baseApiFetch(`${EMAIL_ENGINE_API_URL}${url}`, payload, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${EMAIL_ENGINE_API_KEY}`,
        },
    });
};
