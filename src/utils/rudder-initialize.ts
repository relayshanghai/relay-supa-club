import { clientLogger } from './logger-client';

const disabled = process.env.NEXT_PUBLIC_ENABLE_RUDDERSTACK !== 'true';

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
    if (disabled) {
        turnOffRudderInDev();
    }

    if (window.rudder) {
        return window.rudder;
    }

    //these keys are for RudderStack App-Frontend Source, if we need to add new source we need to add new keys
    const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY;
    const DATA_PLANE_URL = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL;

    if (!WRITE_KEY || !DATA_PLANE_URL) {
        clientLogger('RudderStack keys not set');
        throw new Error('RudderStack keys not set');
    }

    const rudder = await import('rudder-sdk-js').then((rudder) => {
        if (window.rudder) {
            return window.rudder;
        }

        rudder.load(WRITE_KEY, DATA_PLANE_URL, {
            integrations: { All: true }, // load call options
        });

        window.rudder = rudder;
        return rudder;
    });

    return rudder;
}
