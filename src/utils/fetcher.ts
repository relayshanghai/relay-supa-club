/** TODO: seems to be used only for Stripe? Re-org and put all stripe related work together */
export const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => res.json());

const handleResError = async (res: Response) => {
    if (!res.status.toString().startsWith('2')) {
        const json = await res.json();
        if (json?.error)
            throw new Error(
                typeof json.error === 'string' ? json.error : JSON.stringify(json.error),
            );
        if (json?.message)
            throw new Error(
                typeof json.message === 'string' ? json.message : JSON.stringify(json.message),
            );

        if (res.statusText) throw new Error(res.statusText);
        else throw new Error('Something went wrong with the request.');
    }
};

interface RequestInitWithBody extends RequestInit {
    body?: any;
}

/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a type to the generic to get types on your response.
 *  if it encounters an error, it will throw an Error with the error message from the response. Remember to add an `{error: ''}` to api responses.
 * options.body does not need to be stringified.
 * if options.method is POST or PUT, it will set the Content-Type header to application/json
 * @example `const data = await nextFetch<SomeType>('some/path')`
 */
export const nextFetch = async <T = any>(path: string, options: RequestInitWithBody = {}) => {
    const body = options.body;
    if (options.method?.toUpperCase() === 'POST' || options.method?.toUpperCase() === 'PUT') {
        options.headers = {
            'Content-Type': 'application/json',
            // allow manual override of Content-Type by placing this after
            ...options.headers,
        };
    }

    // if it's not a string, stringify it
    const stringified = body && typeof body !== 'string' ? JSON.stringify(body) : body;
    const optionsWithBody = { ...options, body: stringified };
    const res = await fetch('/api/' + path, optionsWithBody);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};
/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a first type to the generic to enforce type safety on passed queries, Add a second type to the generic to get types on your response.
 *  if it encounters an error, it will throw an Error with the error message from the response. Remember to add an `{error: ''}` to api responses.
 * @example `const data = await nextFetchWithQueries<QueryType, SomeType>('some/path')`
 */
export const nextFetchWithQueries = async <Q extends Record<string, string>, T = any>(
    path: string,
    queries: Q,
    options: RequestInit = {},
) => {
    const url = new URL('/api/' + path, window.location.origin);
    for (const key in queries) {
        if (queries.hasOwnProperty(key)) url.searchParams.set(key, queries[key].toString());
    }
    const res = await fetch(url.toString(), options);
    await handleResError(res);
    const json = await res.json();
    return json as T;
};

/**
 *
 * @param url image url
 * @returns
 * @description this function is used to proxy images to bypass the Chinese firewall. "iqfluence.com" is the current instagram profile images domain that does not need the proxy.
 */

// we are considering to setup a new proxy in the future or gain access to the current one. TODO: Ticket V2-44
export function imgProxy(url: string) {
    const proxyUrl = 'https://image-cache.brainchild-tech.cn/?link=';
    if (!url) return;

    if (/iqfluence.com/.test(url)) return url; //iq data changed the instagram profile image domain from sptds.icu to iqfluence.com (2023-03-03)

    return proxyUrl + url;
}
