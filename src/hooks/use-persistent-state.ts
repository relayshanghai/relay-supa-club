import { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { useUser } from 'src/hooks/use-user';
import { appCacheDBKey, persistentStateStoreName } from 'src/constants';
import { simpleStorageHandler } from 'src/utils/cache-provider';

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
    onLoadUpdate?: (currentValue: T) => T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
    const { profile } = useUser();

    const [state, setState] = useState<T>(() => {
        // Setup the database and return the initial value
        const setup = async () => {
            const db = await openDB(appCacheDBKey(profile?.id), 2, {
                upgrade(upgradeDb, oldVersion) {
                    if (!oldVersion) {
                        simpleStorageHandler.initialize(upgradeDb, persistentStateStoreName(profile?.id, key));
                    } else {
                        simpleStorageHandler.upgrade(upgradeDb, persistentStateStoreName(profile?.id, key), oldVersion);
                    }
                },
            });

            let value = await db.get(persistentStateStoreName(profile?.id, key), key);

            // Backward compatibility: If value doesn't exist with user-specific key, look for old key
            if (value === undefined && profile) {
                value = await db.get(persistentStateStoreName(profile?.id, key), key);
                if (value !== undefined) {
                    // Migrate data to new key
                    await db.put(persistentStateStoreName(profile?.id, key), value, key);
                    await db.delete(persistentStateStoreName(profile?.id, key), key);
                }
            }

            value = value ?? initialValue;
            value = onLoadUpdate ? onLoadUpdate(value) : value;

            setState(value);
        };

        setup();

        return initialValue;
    });

    useEffect(() => {
        // Update the value in the database when state changes
        const updateDB = async () => {
            const db = await openDB(appCacheDBKey(profile?.id), 2);
            await db.put(persistentStateStoreName(profile?.id, key), state, key);
        };

        updateDB();
    }, [key, state, profile?.id]);

    const removeState = async () => {
        setState(initialValue);
        const db = await openDB(appCacheDBKey(profile?.id), 2);
        await db.delete(persistentStateStoreName(profile?.id, key), key);
    };

    return [state, setState, removeState];
};
