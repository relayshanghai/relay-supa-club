import { useCallback, useEffect, useRef, useState } from 'react';
import type { apiObject, apiOptions } from 'rudder-sdk-js';
import type { eventKeys, payloads } from 'src/utils/analytics/events';
import type { TrackedEvent, TriggerEvent } from 'src/utils/analytics/types';
import type { CompanyDB, ProfileDB, ProfilesTable } from 'src/utils/api/db';
import { rudderInitialized } from 'src/utils/rudder-initialize';
import { useGetCurrentPage } from './use-get-current-page';
import type { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { MixpanelPeoplePropsInc } from 'src/utils/analytics/constants';
import type { SubscriptionGetResponse } from 'pages/api/subscriptions';
import { formatDate } from 'src/utils/datetime';

//There are more traits properties, but we only need these for now. Ref: https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export interface IdentityTraits extends apiObject {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: {
        id?: string;
        name?: string;
    };
    companyId?: string;
    companyName?: string;
    number?: string;
    lang?: string;
    paidUserSince?: string;
    productCategory?: string;
    products?: string;
    subscriptionStatus?: string;
}

export interface PageProperties extends apiObject {
    path?: string;
    url?: string;
    title?: string;
    referer?: string;
    search?: string;
}

type RudderstackMessageType<TProps = any, TTraits = any> = {
    channel: string;
    context: {
        app: {
            name: string;
            namespace: string;
            version: string;
        };
        traits: TTraits;
        library: {
            name: string;
            version: string;
        };
        userAgent: string;
        device: string | null;
        network: string | null;
        os: {
            name: string;
            version: string;
        };
        locale: string; // ISO 639-1
        screen: {
            density: number;
            width: number;
            height: number;
            innerWidth: number;
            innerHeight: number;
        };
        sessionId: number | string;
        campaign: any;
        page: {
            path: string;
            referrer: string | '$direct';
            referring_domain: string;
            search: string;
            title: string;
            url: string;
            tab_url: string;
            initial_referrer: string | '$direct';
            initial_referring_domain: string;
        };
    };
    type: string; // possibly rudderstack event types
    messageId: string; // uuid
    originalTimestamp: string; // ISO date
    anonymousId: string; // uuid
    userId: string; // uuid
    event: string;
    properties: TProps;
    user_properties: any;
    integrations: {
        All: boolean;
    };
    sentAt: string; // ISO date
};

export const profileToIdentifiable = (
    profile: ProfilesTable['Row'],
    company?: CompanyDB,
    user?: any,
    lang?: string,
    subscription?: SubscriptionGetResponse,
) => {
    const { id, email, first_name, last_name, company_id, user_role } = profile;
    const subscriptionStatus = subscription?.status ?? '';

    const traits: apiObject = {
        email: email || '',
        firstName: first_name,
        lastName: last_name,
        userRole: user_role || '',
        company: {
            id: company_id || '',
        },
        companyId: company_id ?? '',
        companyName: company?.name ?? '',
        number: user?.phone ?? '',
        lang,
        paidUserSince: company?.subscription_start_date ?? '',
        subscriptionStatus: subscriptionStatus.toLowerCase(),
        createdAt: profile.created_at ? formatDate(profile.created_at, '[time]') : '',
    };

    return { id, traits };
};

export const useRudderstack = () => {
    const identifyUser = useCallback(async (userId: string, traits: IdentityTraits) => {
        const rudder = await rudderInitialized();

        rudder.identify(userId, traits);
    }, []);

    const pageView = useCallback(async (pageName: string, properties?: PageProperties) => {
        const rudder = await rudderInitialized();
        rudder.page(pageName, properties);
    }, []);

    const trackEvent = useCallback(async (eventName: string, properties?: apiObject) => {
        const rudder = await rudderInitialized();
        rudder.track(eventName, properties);
    }, []);

    const group = useCallback(async (groupId: string, traits?: apiObject) => {
        const rudder = await rudderInitialized();
        rudder.group(groupId, traits);
    }, []);

    const identifyFromProfile = useCallback(
        (
            profile: ProfileDB,
            company?: CompanyDB,
            user?: any,
            lang?: string,
            subscription?: SubscriptionGetResponse,
        ) => {
            if (!profile) return;
            const { id, traits } = profileToIdentifiable(profile, company, user, lang, subscription);
            identifyUser(id, traits);
        },
        [identifyUser],
    );

    return {
        identifyFromProfile,
        identifyUser,
        pageView,
        trackEvent,
        group,
    };
};

export const useRudder = () => {
    const [rudder, setRudder] = useState(() => (typeof window !== 'undefined' ? window.rudder : null));

    useEffect(() => {
        rudderInitialized().then((rudder) => {
            setRudder(rudder);
        });
    }, []);

    return rudder;
};

type RudderstackTrackResolveType = RudderstackMessageType[] | null | Error;
type PromiseExecutor = (
    ...args: Parameters<ConstructorParameters<typeof Promise<RudderstackTrackResolveType>>[0]>
) => void;

type RudderstackTrackPayload<T extends eventKeys> = Omit<payloads[T], 'currentPage'> & {
    currentPage?: CurrentPageEvent;
    $add?: { [key in MixpanelPeoplePropsInc]?: number };
};

export const useRudderstackTrack = () => {
    const isAborted = useRef(false);
    const rudder = useRudder();
    const currentPage = useGetCurrentPage();

    const track = useCallback(
        <E extends TrackedEvent>(
            event: E,
            properties?: RudderstackTrackPayload<E['eventName']>,
            options?: apiOptions,
        ) => {
            const abort = () => {
                isAborted.current = true;
            };

            const executor: PromiseExecutor = function (resolve) {
                if (!rudder) {
                    return resolve(null);
                }

                if (isAborted.current === true) {
                    return resolve(null);
                }

                const { $add, ...eventPayload } = properties ?? {};

                const trigger: TriggerEvent = (eventName, payload) => {
                    rudder.track(
                        eventName,
                        { currentPage, ...payload, ...$add },
                        options,
                        (...args: RudderstackMessageType[]) => {
                            resolve(args);
                            return args;
                        },
                    );
                };

                event(trigger, eventPayload);
            };

            const request = new Promise<RudderstackTrackResolveType>(executor);

            return { request, abort };
        },
        [rudder, currentPage],
    );

    return { track };
};
