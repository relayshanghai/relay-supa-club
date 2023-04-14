import type { apiObject } from 'rudder-sdk-js';
import { rudderInitialized } from 'src/utils/rudder-initialize';

//There are more traits properties, but we only need these for now. Ref: https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export interface IdentityTraits extends apiObject {
    email: string;
    firstName: string;
    lastName: string;
    company: {
        id?: string;
        name?: string;
    };
}

export interface PageProperties extends apiObject {
    path?: string;
    url?: string;
    title?: string;
    referer?: string;
    search?: string;
}

export const useRudderstack = () => {
    rudderInitialized();
    const IdentifyUser = (userId: string, traits: IdentityTraits) => {
        if (window !== undefined) {
            window.rudder.identify(userId, traits);
        }
    };

    const Page = (pageName: string, properties?: PageProperties) => {
        if (window !== undefined) {
            window.rudder.page(pageName, properties);
        }
    };

    const Track = (eventName: string, properties?: apiObject) => {
        if (window !== undefined) {
            window.rudder.track(eventName, properties);
        }
    };

    return {
        IdentifyUser,
        Page,
        Track,
    };
};
