import { useCallback, useEffect, useState } from 'react';
import { type IDBPDatabase } from 'idb';
import { useUser } from 'src/hooks/use-user';
import { appCacheDBKey, appCacheStoreName, cacheVersion } from 'src/constants';
import { initializeDB } from 'src/utils/cache-provider/cache-provider';
import { clientLogger } from 'src/utils/logger-client';

const version = cacheVersion;

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
    const { profile } = useUser();

    const [db, setDb] = useState<IDBPDatabase<unknown> | null>(null);

    const [state, setState] = useState<T>(initialValue);

    useEffect(() => {
        const setupDB = async () => {
            if (!profile?.id) return;
            const db = await initializeDB(appCacheDBKey(profile?.id), appCacheStoreName, version);
            setDb(db);
            const existing = await db.get(appCacheStoreName, key);
            setState(existing !== undefined ? existing : initialValue); // can't just check truthy cause the value could be a boolean (false)
        };

        // Update the value in the database when state changes
        const updateDB = async () => {
            if (!db) return;

            try {
                await db.put(appCacheStoreName, state, key);
            } catch (error: any) {
                if (error?.message?.includes('The database connection is closing')) {
                    // Reopen the database
                    const reopenedDb = await initializeDB(appCacheStoreName, appCacheDBKey(profile?.id), version);
                    setDb(reopenedDb);
                    // Retry the operation
                    await reopenedDb.put(appCacheStoreName, state, key);
                } else {
                    clientLogger(error.message, 'error');
                }
            }
        };

        if (!db) {
            setupDB();
        } else {
            updateDB();
        }
    }, [key, state, profile?.id, db, initialValue]);

    const removeState = useCallback(async () => {
        setState(initialValue);
        if (!db) return;
        await db.delete(appCacheStoreName, key);
    }, [db, initialValue, key]);

    return [state, setState, removeState];
};
