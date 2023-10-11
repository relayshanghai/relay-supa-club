import { useEffect, useState } from 'react';

export const useAppcues = () => {
    const [appcues, setAppcues] = useState(() => (typeof window !== 'undefined' ? window.Appcues : null));

    useEffect(() => {
        const appcues = typeof window !== 'undefined' ? window.Appcues : null;

        if (appcues) {
            setAppcues((s: typeof appcues) => (s !== appcues ? appcues : s));
        }
    }, []);

    return appcues;
};
