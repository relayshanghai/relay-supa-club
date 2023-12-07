import { useEffect, useState } from 'react';

export const useMixpanel = () => {
    const [mixpanel, setMixpanel] = useState(() => (typeof window !== 'undefined' ? window.mixpanel : null));

    useEffect(() => {
        setMixpanel((s: any) => (s !== window.mixpanel && window.mixpanel ? window.mixpanel : s));
    }, []);

    return mixpanel;
};
