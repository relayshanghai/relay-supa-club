import type * as ruddersdk from 'rudder-sdk-js';
import type { apiObject } from 'rudder-sdk-js';
import type { ProfileDB } from 'src/utils/api/db';

export type RudderSDK = typeof ruddersdk;

export interface IdentityTraits extends apiObject {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: {
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

const identifyUser = (ruddersdk: RudderSDK) => async (userId: string, traits: IdentityTraits) => {
    ruddersdk.identify(userId, traits);
};

const pageView = (ruddersdk: RudderSDK) => async (pageName: string, properties?: PageProperties) => {
    ruddersdk.page(pageName, properties);
};

const trackEvent = (ruddersdk: RudderSDK) => async (eventName: string, properties?: apiObject) => {
    ruddersdk.track(eventName, properties);
};

const group = (ruddersdk: RudderSDK) => async (groupId: string, traits?: apiObject) => {
    ruddersdk.group(groupId, traits);
};

const identifyFromProfile = (ruddersdk: RudderSDK) => (profile: ProfileDB) => {
    if (!profile) return;

    const { id, email, first_name, last_name, company_id, user_role } = profile;

    identifyUser(ruddersdk)(id, {
        email: email || '',
        firstName: first_name,
        lastName: last_name,
        userRole: user_role || '',
        company: {
            id: company_id || '',
        },
    });
};

export const rudderstack = (sdk: RudderSDK) => {
    return {
        ...sdk,
        instance: () => sdk,
        identifyUser: identifyUser(sdk),
        pageView: pageView(sdk),
        trackEvent: trackEvent(sdk),
        group: group(sdk),
        identifyFromProfile: identifyFromProfile(sdk),
    };
};

export type rudderstack = ReturnType<typeof rudderstack>;

export const loadRudderstack = async (
    writeKey: string,
    dataPlane: string,
    onReady: (ruddersdk: rudderstack) => void,
) => {
    const rudder = await import('rudder-sdk-js');

    rudder.ready(() => {
        onReady(rudderstack(rudder));
    });

    rudder.load(writeKey, dataPlane, { integrations: { All: true } });
};
