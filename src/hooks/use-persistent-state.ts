import { useCallback, useEffect, useState } from 'react';
import { openDB, type IDBPDatabase } from 'idb';
import { useUser } from 'src/hooks/use-user';
import { appCacheDBKey, appCacheStoreName, cacheVersion } from 'src/constants';
import { simpleStorageHandler } from 'src/utils/cache-provider';

const version = cacheVersion;

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
    onLoadUpdate?: (currentValue: T) => T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
    const { profile } = useUser();

    const [db, setDb] = useState<IDBPDatabase<unknown> | null>(null);

    const openTheDB = useCallback(
        async () =>
            await openDB(appCacheDBKey(profile?.id), version, {
                upgrade(upgradeDb, oldVersion) {
                    if (!oldVersion) {
                        simpleStorageHandler.initialize(upgradeDb, appCacheStoreName);
                    } else {
                        simpleStorageHandler.upgrade(upgradeDb, appCacheStoreName, oldVersion);
                    }
                },
            }),
        [profile?.id],
    );

    const [state, setState] = useState<T>(() => {
        // Setup the database and return the initial value
        const setup = async () => {
            if (!db) return;

            let value = await db.get(appCacheStoreName, key);

            value = value ?? initialValue;
            value = onLoadUpdate ? onLoadUpdate(value) : value;

            setState(value);
        };

        setup();

        return initialValue;
    });

    useEffect(() => {
        const setupDB = async () => {
            if (!profile?.id) return;

            const db = await openTheDB();
            setDb(db);
        };

        // Update the value in the database when state changes
        const updateDB = async () => {
            if (!db) return;

            const value = await db.get(appCacheStoreName, key);

            if (value === state) return;
            if (value === undefined) {
                db.add(appCacheStoreName, state, key);
            }
            await db.put(appCacheStoreName, state, key);
        };

        if (!db) {
            setupDB();
        } else {
            updateDB();
        }
    }, [key, state, profile?.id, openTheDB, db]);

    const removeState = async () => {
        setState(initialValue);
        const db = await openDB(appCacheDBKey(profile?.id), version);
        await db.delete(appCacheStoreName, key);
    };

    return [state, setState, removeState];
};
