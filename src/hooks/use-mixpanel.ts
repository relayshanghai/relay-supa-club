import { useEffect, useState } from 'react';

export const useMixpanel = () => {
    const [mixpanel, setMixpanel] = useState(() => (typeof window !== 'undefined' ? window.mixpanel : null));

    useEffect(() => {
        if (window.mixpanel) {
            setMixpanel((s: any) => (s !== window.mixpanel ? window.mixpanel : s));
        }
    }, []);

    return mixpanel;
};
