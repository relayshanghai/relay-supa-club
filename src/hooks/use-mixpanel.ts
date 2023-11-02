import { useEffect, useState } from 'react';
import { useRudder } from './use-rudderstack';

export const useMixpanel = () => {
    const rudder = useRudder();
    const [mixpanel, setMixpanel] = useState(() => (typeof window !== 'undefined' ? window.mixpanel : null));

    useEffect(() => {
        const loader = () => {
            if (window.mixpanel) {
                setMixpanel((s: any) => (s !== window.mixpanel ? window.mixpanel : s));
            }
        };
        window.addEventListener('load', loader);
        return () => window.removeEventListener('load', loader);
    }, [rudder]);

    return mixpanel;
};
