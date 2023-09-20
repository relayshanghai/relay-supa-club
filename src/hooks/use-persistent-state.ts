import { useEffect, useState } from 'react';
import { getItem, setItem, removeItem } from '@analytics/storage-utils';

export const usePersistentState = <T>(
    key: string,
    initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, (key: string) => void] => {
    const [state, setState] = useState<T>(() => {
        const storedValue = getItem(key);
        return storedValue ?? initialValue;
    });

    useEffect(() => {
        setItem(key, state);
    }, [key, state]);

    const removeState = (key: string) => {
        setState(initialValue);
        removeItem(key);
    };

    return [state, setState, removeState];
};
