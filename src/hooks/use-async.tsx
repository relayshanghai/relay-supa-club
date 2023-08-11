import { useRef, useState, useCallback } from 'react';

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
 *  - calls the wrapped function and returns a Promise
 */
export const useAsync = <T extends (...args: any[]) => Promise<any>>(fetcher: T) => {
    type Data = {
        isLoading: boolean | null;
        data: Awaited<ReturnType<T>> | null;
        error: any;
    };

    const request = useRef<Promise<void> | ReturnType<T>>(Promise.resolve());

    const [data, setData] = useState<Data>({
        isLoading: null,
        data: null,
        error: null,
    });

    const call = useCallback(
        (...args: Parameters<T>) => {
            if (data.isLoading === true) return request.current;

            request.current = fetcher(...args)
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

            return request.current as ReturnType<T>;
        },
        [fetcher, data.isLoading],
    );

    return { ...data, call };
};
