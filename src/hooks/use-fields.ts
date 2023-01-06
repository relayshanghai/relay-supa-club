import { useCallback, useState } from 'react';

export const useFields = <T = Record<string, string | number>>(initialValues: T) => {
    const [values, setValues] = useState(initialValues);
    const setFieldValue = useCallback(
        (name: keyof T, value: T[keyof T]) => {
            setValues((snap) => ({
                ...snap,
                [name]: value
            }));
        },
        [setValues]
    );

    return {
        setFieldValue,
        reset: setValues,
        values
    };
};
