import { useCallback, useEffect, useState } from 'react';
import { openDB, type IDBPDatabase } from 'idb';
import { useUser } from 'src/hooks/use-user';
import { appCacheDBKey, appCacheStoreName, cacheVersion } from 'src/constants';
import { initializeDB } from 'src/utils/cache-provider/cache-provider';

const version = cacheVersion;

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
    const { profile } = useUser();

    const [db, setDb] = useState<IDBPDatabase<unknown> | null>(null);

    const openTheDB = useCallback(
        () => initializeDB(appCacheDBKey(profile?.id), appCacheStoreName, version),
        [profile?.id],
    );

    const [state, setState] = useState<T>(() => {
        // Setup the database and return the initial value
        const setup = async () => {
            let existingDB = db;
            if (!existingDB) {
                existingDB = await openTheDB();
                setDb(existingDB);
            }
            const existing = await existingDB.get(appCacheStoreName, key);

            setState(existing ?? initialValue);
        };

        setup();

        return initialValue;
    });

    useEffect(() => {
        const setupDB = async () => {
            if (!profile?.id) return;

            setDb(await openTheDB());
        };

        // Update the value in the database when state changes
        const updateDB = async () => {
            if (!db) return;

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
