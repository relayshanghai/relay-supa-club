import type { Cache as SWRCache, State as SWRState } from 'swr';
import { openDB } from 'idb';

import type { CacheProvider, Config } from './types';
import simpleStorageHandler from './storage-handler/simple';

// Unlinke what SWR types suggest, key is always a serialized string
type Key = string;

export const initializeDB = async (dbName: string, storeName: string, version: number) =>
    await openDB(dbName, version, {
        upgrade(upgradeDb, oldVersion) {
            if (!oldVersion) {
                simpleStorageHandler.initialize(upgradeDb, storeName);
            } else {
                simpleStorageHandler.upgrade(upgradeDb, storeName, oldVersion);
            }
        },
    });

/**
 * Cache provider factory
 */
export default async function createCacheProvider<Data = any, Error = any>({
    dbName,
    storeName,
    storageHandler = simpleStorageHandler,
    version = 1,
    onError = () => null,
}: Config): Promise<CacheProvider> {
    type Cache = SWRCache<Data>;
    type State = SWRState<Data, Error>;

    const db = await initializeDB(dbName, storeName, version);

    // Get storage snapshot
    const map = new Map<Key, State>();

    let cursor = await db.transaction(storeName, 'readwrite').store.openCursor();

    while (cursor) {
        const key = cursor.key as Key;
        const value = storageHandler.revive(key, cursor.value);

        // Stale
        if (value === undefined) {
            cursor.delete();
            // OK
        } else {
            map.set(key, value);
        }

        cursor = await cursor.continue();
    }

    /**
     * SWR Cache provider API
     */
    return (_globalCache: Readonly<Cache>): Cache => ({
        keys: () => map.keys(),

        get: (key: Key): State | undefined => map.get(key),

        set: (key: Key, value: State): void => {
            map.set(key, value);

            if (isFetchInfo(value)) {
                return;
            }

            const storeValue = storageHandler.replace(key, value);

            if (storeValue === undefined) {
                return;
            }

            db.put(storeName, storeValue, key).catch(onError);
        },

        /**
         * Used only by useSWRInfinite
         */
        delete: (key: Key): void => {
            if (map.delete(key)) {
                db.delete(storeName, key).catch(onError);
            }
        },

        /**
         * Documented, but missing method type
         * @link https://swr.vercel.app/docs/advanced/cache#access-to-the-cache
         * @link https://github.com/vercel/swr/pull/1936
         */
        // @ts-ignore
        clear: (): void => {
            map.clear();
            db.clear(storeName);
        },
    });

    /**
     * Do not store as non-native errors are not serializable, other properties are optional
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types
     */
    function isFetchInfo(state: State): boolean {
        return state.error instanceof Error || state.isValidating === true || state.isLoading === true;
    }
}
