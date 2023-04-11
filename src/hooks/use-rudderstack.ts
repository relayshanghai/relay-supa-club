import { useEffect } from 'react';

export async function InitiateRudderstackFrontend() {
    //these keys are for RudderStack App-Frontend Source, if we need to add new source we need to add new keys
    const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY;
    const DATA_PLANE_URL = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL;

    useEffect(() => {
        const rudderInitialized = async () => {
            if (!WRITE_KEY || !DATA_PLANE_URL) {
                return;
            }
            window.rudder = await import('rudder-sdk-js');

            window.rudder?.load(WRITE_KEY, DATA_PLANE_URL, {
                integrations: { All: true }, // load call options
            });

            window.rudder?.ready(() => {
                //eslint-disable-next-line no-console
                console.log('All set!');
            });
        };

        rudderInitialized();
    }, [DATA_PLANE_URL, WRITE_KEY]);
}

export const useRudderstack = () => {
    const Identify = () => {
        if (typeof window === 'undefined') return;
        window.rudder?.identify;
    };
    const Page = () => {
        if (typeof window === 'undefined') return;
        window.rudder?.page;
    };

    const Track = () => {
        if (typeof window === 'undefined') return;
        window.rudder?.track;
    };

    return {
        Identify,
        Page,
        Track,
    };
};
