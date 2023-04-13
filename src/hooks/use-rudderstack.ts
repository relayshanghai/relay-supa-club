import type { apiObject } from 'rudder-sdk-js';

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
    const IdentifyUser = (userId: string, traits: IdentityTraits) => {
        window.rudder.identify(userId, traits);
    };

    const Page = (pageName: string, properties?: PageProperties) => {
        window.rudder.page(pageName, properties);
    };

    const Track = (eventName: string, properties?: apiObject) => {
        window.rudder.track(eventName, properties);
    };

    return {
        IdentifyUser,
        Page,
        Track,
    };
};
