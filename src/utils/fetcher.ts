/** TODO: seems to be used only for Stripe? Re-org and put all stripe related work together */
export const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => res.json());

/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a type to the generic to get types on your response.
 *  if it encounters an error, it will throw an Error with the error message from the response. Remember to add an `{error: ''}` to api responses.
 * @example `const data = await nextFetch<SomeType>('some/path')`
 */
export const nextFetch = async <T = any>(path: string, options: RequestInit = {}) => {
    const res = await fetch('/api/' + path, options);
    if (!res.status.toString().startsWith('2')) {
        const json = await res.json();
        if (json?.error)
            throw new Error(
                typeof json.error === 'string' ? json.error : JSON.stringify(json.error)
            );
        if (json?.message)
            throw new Error(
                typeof json.message === 'string' ? json.message : JSON.stringify(json.message)
            );
        if (res.statusText) throw new Error(res.statusText);
        else throw new Error('Something went wrong with the request.');
    }
    return (await res.json()) as T;
};

export function imgProxy(url: string) {
    const proxyUrl = 'https://image-cache.brainchild-tech.cn/?link=';
    if (!url) return;
    if (/sptds.icu/.test(url)) return url;

    return proxyUrl + url;
}
