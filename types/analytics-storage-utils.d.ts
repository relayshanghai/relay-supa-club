declare module '@analytics/storage-utils' {
    type Storage = 'localStorage' | 'cookies' | 'sessionStorage' | 'global';

    type Item<T = any> = {
        current: T;
        previous: T;
        location: Storage;
    };

    type Options = {
        storage: Storage | '*';
    };

    type GetAllReturn<T = any> = {
        cookie: undefined | null | T;
        localStorage: undefined | null | T;
        sessioStorage: undefined | null | T;
        global: undefined | null | T;
    };

    function setItem<T = any>(key: string, value: T, options?: Options): Item<T>;
    function getItem<T = any>(key: string, options: { storage: '*' }): GetAllReturn<T>;
    function getItem<T = any>(key: string, options?: Options): T | undefined;
    function removeItem(key: string, options?: Options): void;
}
