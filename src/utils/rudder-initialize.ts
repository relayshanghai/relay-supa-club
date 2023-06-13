import { clientLogger } from './logger-client';

const turnOffRudderInDev = () => {
    window.rudder = {
        load: () => null,
        ready: () => null,
        reset: () => null,
        page: () => null,
        track: () => null,
        identify: () => null,
        alias: () => null,
        group: () => null,
        setAnonymousId: () => null,
        getAnonymousId: () => '',
        getUserId: () => '',
        getUserTraits: () => null as any,
        getGroupId: () => '',
        getGroupTraits: () => null as any,
        startSession: () => null,
        endSession: () => null,
        getSessionId: () => null,
    };
};

export async function rudderInitialized() {
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_CI === 'true') {
        return turnOffRudderInDev();
    }
    //these keys are for RudderStack App-Frontend Source, if we need to add new source we need to add new keys
    const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY;
    const DATA_PLANE_URL = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL;

    if (!WRITE_KEY || !DATA_PLANE_URL) {
        clientLogger('RudderStack keys not set');
        throw new Error('RudderStack keys not set');
    }

    window.rudder = await import('rudder-sdk-js');
    const rudder = (window.rudder = window.rudder || []);

    rudder.load(WRITE_KEY, DATA_PLANE_URL, {
        integrations: { All: true }, // load call options
    });

    // rudder.ready(() => {
    //     //eslint-disable-next-line no-console
    //     console.log('All set!');
    // });
}
