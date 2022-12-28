/** TODO: seems to be used only for Stripe? Re-org and put all stripe related work together */
export const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => res.json());

/**
 *
 * @param path will be prefixed by `/api/`
 * @returns fetch .json() data
 * @description fetcher for internal next API routes. Add a type to the generic to get types on your response.
 * @example `const data = await nextFetch<SomeType>('some/path')`
 */
export const nextFetch = async <T = any>(path: string, options: RequestInit = {}) => {
    const res = await fetch('/api/' + path, options);
    return (await res.json()) as T;
};

export function imgProxy(url: string) {
    const proxyUrl = 'https://image-cache.brainchild-tech.cn/?link=';
    if (!url) return;
    if (/sptds.icu/.test(url)) return url;

    return proxyUrl + url;
}
