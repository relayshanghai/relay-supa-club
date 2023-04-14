export async function rudderInitialized(waitMs = 5000): Promise<Window['rudder']> {
    window.rudder = (await import('rudder-sdk-js')) as unknown as Window['rudder'];

    return new Promise((resolve, reject) => {
        //these keys are for RudderStack App-Frontend Source, if we need to add new source we need to add new keys
        const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_WRITE_KEY;
        const DATA_PLANE_URL = process.env.NEXT_PUBLIC_RUDDERSTACK_APP_DATA_PLANE_URL;

        if (!WRITE_KEY || !DATA_PLANE_URL) {
            //eslint-disable-next-line no-console
            console.log('RudderStack keys not set');
            return reject('RudderStack keys not set');
        }
        const rudder = (window.rudder = window.rudder || []);

        rudder.load(WRITE_KEY, DATA_PLANE_URL, {
            integrations: { All: true }, // load call options
        });

        rudder.ready(() => {
            //eslint-disable-next-line no-console
            console.log('All set!');
            return resolve(rudder);
        });
        setTimeout(() => {
            //eslint-disable-next-line no-console
            console.log('RudderStack load timeout');
            return reject('RudderStack load timeout');
        }, waitMs);
    });
}
