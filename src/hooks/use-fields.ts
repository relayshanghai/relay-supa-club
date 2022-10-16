import { useCallback, useState } from 'react';

export const useFields = (initialValues: any) => {
    const [values, setValues] = useState(initialValues);
    const setFieldValue = useCallback(
        (name: any, value: any) => {
            setValues((snap: any) => ({
                ...snap,
                [name]: value
            }));
        },
        [setValues]
    );

    return {
        setFieldValue,
        values
    };
};
