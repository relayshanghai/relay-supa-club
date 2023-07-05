import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { RequestInitWithBody } from 'src/utils/fetcher';
import { handleResError } from 'src/utils/fetcher';
const ENGAGE_URL = 'https://email.api.engagelab.cc/v1/';
const addDomainPath = 'domains';
const checkDomainPath = 'domains/check';
const sendEmailPath = 'mail/send';
const ENGAGE_LAB_API_KEY = process.env.ENGAGE_LAB_API_KEY;
if (!ENGAGE_LAB_API_KEY) {
    throw new Error('ENGAGE_LAB_API_KEY not found in env');
}
const engageAuthHeaders = {
    Authorization: 'Basic ' + ENGAGE_LAB_API_KEY,
};

/**
 *
 * @param path will be prefixed by `https://email.api.engagelab.cc/v1/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs:https://www.engagelab.com/docs/email/
 */
export const engageFetch = async <T = any>(path: string, options: RequestInitWithBody = {}) => {
    const body = options.body;
    const method = options.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.headers = {
            'Content-Type': 'application/json; charset=utf-8',
            // allow manual override of Content-Type by placing this after
            ...options.headers,
            ...engageAuthHeaders,
        };
    }

    // if it's not a string, stringify it
    const stringified = body && typeof body !== 'string' ? JSON.stringify(body) : body;
    const optionsWithBody = { ...options, body: stringified };

    const res = await fetch(ENGAGE_URL + path, optionsWithBody);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};

export const engageFetchWithQueries = async <Q extends Record<string, string>, T = any>(
    path: string,
    queries: Q,
    options: RequestInit = {},
) => {
    const url = new URL(ENGAGE_URL + path);
    for (const key in queries) {
        if (queries.hasOwnProperty(key)) url.searchParams.set(key, queries[key].toString());
    }
    const res = await fetch(url.toString(), options);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};
type AddDomainRequestBody = {
    /** domain name. It must conform to the domain name format and can only contain [0-9a-zA-Z -.], 4~255 characters, such as mail.test.best.
     */
    name: string;
};
interface DKIM {
    domain: string;
    value: string;
    verify: boolean;
}

export interface AddDomainResponse {
    result: {
        domain_id: number;
        name: string;
        type: number;
        ip_type: number;
        spf: DKIM;
        dkim: DKIM;
        mx: DKIM;
        dmarc: DKIM;
        create_time: string;
        update_time: string;
    };
}

const addDomain = async (domain: string) => {
    const body: AddDomainRequestBody = {
        name: domain,
    };

    return engageFetch<AddDomainResponse>(addDomainPath, {
        method: 'POST',
        body,
    });
};

type CheckDomainQueries = {
    /** domain name. Multiple use ';'  separate. */
    name: string;
    type?: string;
};

export type CheckDomainResponse = {
    result: {
        name: string;
        type: number;
        config: {
            dkim: boolean;
            mx: boolean;
            spf: boolean;
            dmarc: boolean;
        };
        /** 0:unverified 1:usable 2:Verified */
        status: number;
    }[];
};

const checkDomain = async (domain: string) =>
    engageFetchWithQueries<CheckDomainQueries, CheckDomainResponse>(checkDomainPath, {
        name: domain,
    });

/** https://www.engagelab.com/docs/email/rest-api/deliverlies */
type SendEmailRequestBody = {
    from: string;
    to: string[];
    body: {
        subject: string;
        content: {
            /**  must include either html or text */
            html?: string;
            /**  must include either html or text */
            text?: string;
            preview_text?: string;
        };
        cc?: string[];
        bcc?: string[];
        reply_to?: string[];
        vars?: any;
        label_id?: number;
        headers?: Headers;
        attachments?: {
            content: string;
            type: string;
            filename: string;
            disposition: string;
            content_id: string;
        }[];
        settings?: {
            /** use 0 for regular email address, 2 for saved lists */
            send_mode: number;
            return_email_id: boolean;
            sandbox: boolean;
            notification: boolean;
            open_tracking: boolean;
            click_tracking: boolean;
            unsubscribe_tracking: boolean;
            unsubscribe_page_id: number[];
        };
    };
    custom_args?: any;
    request_id?: string;
};
/** for send_mode 0 or 1 */
type SendEmailResponse = {
    email_ids: string[];
    request_id: string;
};

const sendEmail = async (body: SendEmailRequestBody) => {
    return engageFetch<SendEmailResponse>(sendEmailPath, {
        method: 'POST',
        body,
    });
};

export type EngageRegisterDomainPostBody = {
    type: 'registerDomain';
    domain: string;
};
export type EngageCheckDomainPostBody = {
    type: 'checkDomain';
    domain: string;
};
export type EngageSendEmailPostBody = SendEmailRequestBody & {
    type: 'sendEmail';
};

export type EngagePostBody = EngageRegisterDomainPostBody | EngageCheckDomainPostBody | EngageSendEmailPostBody;

const postHandler: NextApiHandler = async (req, res) => {
    const { type } = req.body as EngagePostBody;

    if (type === 'registerDomain') {
        const { type: _, ...rest } = req.body as EngageRegisterDomainPostBody;
        const result = await addDomain(rest.domain);
        return res.status(httpCodes.OK).json(result);
    } else if (type === 'checkDomain') {
        const { type: _, ...rest } = req.body as EngageCheckDomainPostBody;
        const result = await checkDomain(rest.domain);
        return res.status(httpCodes.OK).json(result);
    } else if (type === 'sendEmail') {
        const { type: _, ...rest } = req.body as EngageSendEmailPostBody;
        const result = await sendEmail(rest);
        return res.status(httpCodes.OK).json(result);
    }

    return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request' });
};

export default ApiHandler({
    postHandler,
});
