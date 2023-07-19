import type { RequestInitWithBody } from 'src/utils/fetcher';
import { handleResError } from 'src/utils/fetcher';

export const EMAIL_ENGINE_API_URL = process.env.EMAIL_ENGINE_API_URL
    ? process.env.EMAIL_ENGINE_API_URL + '/v1/'
    : 'http://localhost:4000/v1/';

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;

if (!EMAIL_ENGINE_API_KEY) {
    throw new Error('EMAIL_ENGINE_API_KEY is not defined');
}

const headers = {
    Authorization: `Bearer ${EMAIL_ENGINE_API_KEY}`,
};

export const emailEngineApiFetch = async <T = any>(path: string, options: RequestInitWithBody = {}) => {
    const body = options.body;
    const method = options.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            // allow manual override of content-type by placing this after
            ...headers,
            ...options.headers,
        };
    }
    const stringified = body && typeof body !== 'string' ? JSON.stringify(body) : body;
    const optionsWithBody = { ...options, body: stringified };
    const res = await fetch(`${EMAIL_ENGINE_API_URL}${path}`, optionsWithBody);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};
