import type { NextApiRequest } from 'next';

/**
 * Normalizes Next API request for endpoint validation
 *
 * Since there is no concept of "path" in Next.js routes,
 * this function converts the "query" key as "path"
 *
 * @param  {NextApiRequest}   req       The API request
 * @param  {(string[])} [pick=[]] pick only the specified keys from req.query
 */
export const normalizeRequest = (req: NextApiRequest, pick: string[] = []) => {
    const path =
        pick.length === 0
            ? req.query
            : Object.entries(req.query)
                  .filter(([k, _v]) => pick.includes(k))
                  .reduce((o, [k, v]) => {
                      return { ...o, [k]: v };
                  }, {});

    return {
        path,
        query: req.query,
        body: req.body,
    };
};

/**
 * Shorthand for {@link normalizeRequest|`normalizeRequest`}
 */
export const nreq = normalizeRequest;
