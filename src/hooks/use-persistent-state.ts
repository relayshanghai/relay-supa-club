import { useEffect, useState } from 'react';
import { openDB } from 'idb';

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
    onLoadUpdate?: (currentValue: T) => T,
): [T, React.Dispatch<React.SetStateAction<T>>, (key: string) => void] => {
    const [state, setState] = useState<T>(() => {
        // Setup the database and return the initial value
        const setup = async () => {
            const db = await openDB('app-store', 1, {
                upgrade(db) {
                    db.createObjectStore('app-data');
                },
            });

            let value = await db.get('app-data', key);
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
            const db = await openDB('app-store', 1);
            await db.put('app-data', state, key);
        };

        updateDB();
    }, [key, state]);

    const removeState = async (key: string) => {
        setState(initialValue);
        const db = await openDB('app-store', 1);
        await db.delete('app-data', key);
    };

    return [state, setState, removeState];
};
