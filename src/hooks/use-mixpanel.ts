import { useEffect, useState } from 'react';
import { useRudder } from './use-rudderstack';

export const useMixpanel = () => {
    const rudder = useRudder();
    const [mixpanel, setMixpanel] = useState(() => (typeof window !== 'undefined' ? window.mixpanel : null));

    useEffect(() => {
        setMixpanel((s: any) => (s !== window.mixpanel && window.mixpanel ? window.mixpanel : s));
    }, [rudder]);

    return mixpanel;
};
