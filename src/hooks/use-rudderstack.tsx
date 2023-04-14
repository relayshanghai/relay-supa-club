import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { useState, useEffect, useContext, createContext } from 'react';
import type { apiObject } from 'rudder-sdk-js';
import { clientLogger } from 'src/utils/logger-client';
import { rudderInitialized } from 'src/utils/rudder-initialize';
import { useUser } from './use-user';

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

const waitForTrue = (condition: () => boolean, timeout = 10000, interval = 100) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkCondition = () => {
            if (condition()) {
                resolve(true);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Timeout'));
            } else {
                setTimeout(checkCondition, interval);
            }
        };
        checkCondition();
    });
};

export const reportIsStale = (createdAt: string) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - createdAtDate.getTime();
    return diff > 59 * 24 * 60 * 60 * 1000;
};

export interface RudderStackContext {
    identifyUser: (userId: string, traits: IdentityTraits) => Promise<void>;
    pageView: (pageName: string, properties?: PageProperties) => Promise<void>;
    trackEvent: (eventName: string, properties?: apiObject) => Promise<void>;
}

const rudderStackContext = createContext<RudderStackContext>({
    identifyUser: async () => undefined,
    pageView: async () => undefined,
    trackEvent: async () => undefined,
});

export const RudderStackProvider = ({ children }: PropsWithChildren) => {
    const { profile } = useUser();

    const [rudderStart, setRudderStart] = useState(true);
    const rudder = window?.rudder;
    useEffect(() => {
        const getRudder = async () => {
            try {
                await rudderInitialized(); //enable rudderstack Analytics
            } catch (error) {
                clientLogger(error, 'error');
            } finally {
                setRudderStart(true);
            }
        };
        getRudder();
    }, []);

    const identifyUser = useCallback(
        async (userId: string, traits: IdentityTraits) => {
            await waitForTrue(() => rudderStart);
            rudder?.identify(userId, traits);
        },
        [rudder, rudderStart],
    );

    const pageView = async (pageName: string, properties?: PageProperties) => {
        await waitForTrue(() => rudderStart);

        rudder?.page(pageName, properties);
    };

    const trackEvent = async (eventName: string, properties?: apiObject) => {
        await waitForTrue(() => rudderStart);

        rudder?.track(eventName, properties);
    };

    useEffect(() => {
        if (profile?.id) {
            identifyUser(profile.id, {
                name: `${profile.first_name} ${profile.last_name}`,
                firstName: `${profile.first_name}`,
                lastName: `${profile.last_name}`,
                email: `${profile.email}`,
                company: { id: `${profile.company_id}` },
            });
        }
    }, [identifyUser, profile]);

    const value = {
        identifyUser,
        pageView,
        trackEvent,
    };
    return <rudderStackContext.Provider value={value}>{children}</rudderStackContext.Provider>;
};

export const useRudderstack = () => {
    const context = useContext(rudderStackContext);
    if (context === null) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
