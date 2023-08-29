import { useCallback, useState } from 'react';

/**
 * Converts async into a more reactive way
 *
 * `isLoading`
 *  - has three states. null if no Promise created yet. true if resolving. false if resolved/rejected
 *
 * `data`
 *  - the resolved value
 *
 * `error`
 *  - the rejected value
 *
 * `call`
 *  - calls the wrapped function and returns a Promise. Subsequent calls should return the same promise
 *
 * `refresh`
 *  - flushes internal state
 */
export const useAsync = <T extends (...args: any[]) => Promise<any>>(fetcher: T) => {
    type Data = {
        isLoading: boolean | null;
        data: Awaited<ReturnType<T>> | null;
        error: any;
    };

    // caches each call based on the given parameters
    const [cache] = useState(new Map());

    const [data, setData] = useState<Data>({
        isLoading: null,
        data: null,
        error: null,
    });

    const call = useCallback(
        (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
            const key = JSON.stringify(args);

            if (cache.has(key)) {
                return cache.get(key);
            }

            const req = fetcher(...args)
                .then((data) => {
                    setData((s) => {
                        return { ...s, isLoading: false, data };
                    });
                    return data;
                })
                .catch((error) => {
                    setData((s) => {
                        return { ...s, isLoading: false, error };
                    });
                    return error;
                });

            setData((s) => {
                return { ...s, isLoading: true };
            });

            if (!cache.has(key)) {
                cache.set(key, req);
            }

            return req;
        },
        [fetcher, cache],
    );

    const refresh = useCallback(() => {
        // @todo this seems to don't mean anything now since we return the cached promise
        setData((s) => {
            return { ...s, isLoading: null };
        });

        // @todo clean up only associated cache if args are provided
        //       instead of clearing the whole cache
        cache.clear();

        return { call };
    }, [setData, cache, call]);

    return { ...data, call, refresh };
};
