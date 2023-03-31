import { useCallback, useEffect } from 'react';
export default async function useRudderstack() {
    //these keys are for RudderStack App-Frontend Source, if we need to add new source we need to add new keys
    const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY;
    const DATA_PLANE_URL = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL;

    const rudderInitialized = useCallback(async () => {
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
    }, [DATA_PLANE_URL, WRITE_KEY]);

    useEffect(() => {
        rudderInitialized();
    }, [rudderInitialized]);
}
