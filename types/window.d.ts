import type rudderSDK from 'rudder-sdk-js';

declare global {
    interface Window {
        rudder: Omit<typeof rudderSDK, 'RESIDENCY_SERVER'>
    }
}
