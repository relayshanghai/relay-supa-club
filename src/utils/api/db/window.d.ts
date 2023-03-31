import type rudderSDK from 'rudder-sdk-js';

declare global {
    interface Window {
        // use the rudderanalytics object to call the RudderStack client-side SDK methods
        // from 'rudder-sdk-js'
        rudder?: {
            load: typeof rudderSDK.load;
            ready: typeof rudderSDK.ready;
            reset: typeof rudderSDK.reset;
            page: typeof rudderSDK.page;
            track: typeof rudderSDK.track;
            identify: typeof rudderSDK.identify;
            alias: typeof rudderSDK.alias;
            group: typeof rudderSDK.group;
            setAnonymousId: typeof rudderSDK.setAnonymousId;
            getAnonymousId: typeof rudderSDK.getAnonymousId;
            getUserId: typeof rudderSDK.getUserId;
            getUserTraits: typeof rudderSDK.getUserTraits;
            getGroupId: typeof rudderSDK.getGroupId;
            getGroupTraits: typeof rudderSDK.getGroupTraits;
            startSession: typeof rudderSDK.startSession;
            endSession: typeof rudderSDK.endSession;
            getSessionId: typeof rudderSDK.getSessionId;
        };
    }
}
