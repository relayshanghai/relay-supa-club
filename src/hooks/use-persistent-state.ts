import { useEffect, useState } from 'react';
import { openDB } from 'idb';
import { useUser } from 'src/hooks/use-user';

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
    onLoadUpdate?: (currentValue: T) => T,
): [T, React.Dispatch<React.SetStateAction<T>>, (key: string) => void] => {
    const { profile } = useUser();
    const userSpecificKey = profile ? `${profile.id}-${key}` : key;

    const [state, setState] = useState<T>(() => {
        // Setup the database and return the initial value
        const setup = async () => {
            const db = await openDB('app-store', 2, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('app-data')) {
                        db.createObjectStore('app-data');
                    }
                },
            });

            let value = await db.get('app-data', userSpecificKey);

            // Backward compatibility: If value doesn't exist with user-specific key, look for old key
            if (value === undefined && profile) {
                value = await db.get('app-data', key);
                if (value !== undefined) {
                    // Migrate data to new key
                    await db.put('app-data', value, userSpecificKey);
                    await db.delete('app-data', key);
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
            const db = await openDB('app-store', 2);
            await db.put('app-data', state, userSpecificKey);
        };

        updateDB();
    }, [userSpecificKey, state]);

    const removeState = async () => {
        setState(initialValue);
        const db = await openDB('app-store', 2);
        await db.delete('app-data', userSpecificKey);
    };

    return [state, setState, removeState];
};
