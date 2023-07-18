import type { RequestInitWithBody } from 'src/utils/fetcher';
import { handleResError } from 'src/utils/fetcher';

export const EMAIL_ENGINE_API_URL = process.env.EMAIL_ENGINE_API_URL
    ? process.env.EMAIL_ENGINE_API_URL + '/v1/'
    : 'http://localhost:4000/v1/';

const EMAIL_ENGINE_API_KEY = process.env.EMAIL_ENGINE_API_KEY;
if (!EMAIL_ENGINE_API_KEY) throw new Error('EMAIL_ENGINE_API_KEY is not defined');

interface SequenceInfluencer {
    id: string;
    name: string;
    email: string;
    /** 0 means not sent. 1 means first step sent, awaiting 2. */
    sequenceStep: number;
    /** Will basically follow the campaign influencers status' */
    status: string;
}

export const mockInfluencers: SequenceInfluencer[] = [
    {
        id: '1',
        name: 'Jacob',
        email: 'jacob@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    {
        id: '2',
        name: 'Brendan',
        email: 'brendan@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    { id: '3', name: 'Tech Account', email: 'tech@relay.club', sequenceStep: 0, status: 'To Contact' },
];

const headers = {
    Authorization: `Bearer ${EMAIL_ENGINE_API_KEY}`,
};
const emailEngineApiFetch = async <T = any>(path: string, options: RequestInitWithBody = {}) => {
    const body = options.body;
    const method = options.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.headers = {
            accept: 'application/json',
            'Content-Type': 'application/json',
            // allow manual override of Content-Type by placing this after
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

export interface GenerateAuthLinkRequestBody {
    account?: string;
    name?: string;
    email?: string;
    delegated?: boolean;
    syncFrom?: string;
    notifyFrom?: string;
    subconnections?: string[];
    redirectUrl: string;
    type?: string;
}

export interface GenerateAuthLinkResponse {
    url: string;
}

export const generateAuthLink = async (body: GenerateAuthLinkRequestBody) => {
    const res = await emailEngineApiFetch<GenerateAuthLinkResponse>('authentication/form', {
        method: 'POST',
        body,
    });
    return res.url;
};

/** There are a lot more options available in the  */
export interface SendEmailRequestBody {
    to: {
        address: string;
    }[];
    subject: string;
    /** need either text or html */
    text?: string;
    /** need either text or html */
    html?: string;
}

export interface SendEmailResponseBody {
    response: string;
    messageId: string;
    queueId: string;
    sendAt: string;
    reference: {
        message: string;
        documentStore: boolean;
        success: boolean;
        error: string;
    };
    preview: string;
    mailMerge: {
        success: boolean;
        to: {
            name: string;
            address: string;
        };
        messageId: string;
        queueId: string;
        reference: {
            message: string;
            success: boolean;
        };
        sendAt: string;
    }[];
}

export const sendEmail = async (body: SendEmailRequestBody, account: string) =>
    await emailEngineApiFetch<SendEmailResponseBody>(`account/${encodeURIComponent(account)}/submit`, {
        method: 'POST',
        body,
    });
