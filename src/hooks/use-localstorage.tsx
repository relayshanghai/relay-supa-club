import { useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';

// Define a generic type for the initial value
type InitialValue<T> = T | (() => T);

export const useLocalStorage = <T,>(
    key: string,
    initialValue: InitialValue<T>,
): [T, (value: T | ((val: T) => T)) => void] => {
    // Retrieve the value from localStorage if it exists, otherwise use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') {
                return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
            }

            const item = window.localStorage.getItem(key);
            // Parse JSON if the stored value is an object, otherwise return it as is
            return item
                ? typeof JSON.parse(item) === 'object'
                    ? JSON.parse(item)
                    : item
                : typeof initialValue === 'function'
                ? (initialValue as () => T)()
                : initialValue;
        } catch (error) {
            clientLogger('Error retrieving data from localStorage:' + error, 'error');
            return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
        }
    });

    // Function to update the value in localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function to support functional updates
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Convert non-object types to strings before saving
            const valueString = typeof valueToStore === 'object' ? JSON.stringify(valueToStore) : valueToStore;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, valueString as string);
        } catch (error) {
            clientLogger('Error setting data to localStorage:' + error, 'error');
        }
    };

    return [storedValue, setValue];
};
