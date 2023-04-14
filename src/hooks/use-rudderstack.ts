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
    const identifyUser = async (userId: string, traits: IdentityTraits) => {
        await rudderInitialized();
        window.rudder.identify(userId, traits);
    };

    const pageView = async (pageName: string, properties?: PageProperties) => {
        await rudderInitialized();
        window.rudder.page(pageName, properties);
    };

    const trackEvent = async (eventName: string, properties?: apiObject) => {
        await rudderInitialized();
        window.rudder.track(eventName, properties);
    };

    return {
        identifyUser,
        pageView,
        trackEvent,
    };
};
