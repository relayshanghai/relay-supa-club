import type { apiObject } from 'rudder-sdk-js';

//There are more traits properties, but we only need these for now. Ref: https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export interface IdentityTraits extends apiObject {
    email: string;
    firstName: string;
    lastName: string;
    company: {
        id?: string;
    };
}
export const useRudderstack = () => {
    const IdentifyUser = (userId: string, traits: IdentityTraits) => {
        window.rudder.identify(userId, traits);
    };

    return {
        IdentifyUser,
    };
};
