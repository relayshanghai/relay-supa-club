import type { AnalyticsInstance, AnalyticsPlugin } from 'analytics';

export type AnalyticsEventParam = {
    abort: () => void;
    config: any;
    plugins: AnalyticsPlugin[];
    payload: {
        type: string;
        plugins: any[];
        disabled: any[];
        meta: any[];
    };
    instance: {
        identify: (...params: any[]) => any;
        track: (...params: any[]) => any;
        page: (...params: any[]) => any;
        user: (...params: any[]) => any;
        reset: (...params: any[]) => any;
        ready: (...params: any[]) => any;
        on: (...params: any[]) => any;
        once: (...params: any[]) => any;
        getState: (...params: any[]) => any;
        dispatch: (...params: any[]) => any;
        enablePlugin: (...params: any[]) => any;
        disablePlugin: (...params: any[]) => any;
        setAnonymousId: (...params: any[]) => any;
        plugins: AnalyticsPlugin[];
        storage: any[];
        events: any[];
    };
};

export type AnalyticsEvent = (analytics: AnalyticsInstance) => (value: any) => void;

// @note I really should create a separate package for this now..
export type JourneyObject = {
    id: string;
    name: string;
    status: JourneyStatus;
    created_at?: number;
    updated_at?: number;
    tag?: string;
};

export type JourneyEventPayload = {
    [key: string]: any;
    __tag?: string;
    __previous?: JourneyObject | boolean | void | Promise<JourneyObject | void>;
};

export type Journey = {
    onStart?: (
        journey: JourneyObject,
        payload?: JourneyEventPayload,
    ) => JourneyObject | Promise<JourneyObject | void> | void;
    onEnd?: (
        journey: JourneyObject,
        payload?: Omit<JourneyEventPayload, '__tag' | '__previous'>,
    ) => JourneyObject | Promise<JourneyObject | void> | void;
    onAbort?: (
        journey: JourneyObject,
        payload?: Omit<JourneyEventPayload, '__tag' | '__previous'>,
    ) => JourneyObject | Promise<JourneyObject | void> | void;
    onUpdate?: (
        journey: JourneyObject,
        payload?: Omit<JourneyEventPayload, '__tag'>,
    ) => JourneyObject | Promise<JourneyObject | void> | void;
};

export enum JourneyStatus {
    ONGOING = 'ongoing',
    ENDED = 'ended',
    ABORTED = 'aborted',
}

export type JourneyCollection = {
    [key: string]: (args?: any) => Journey;
};
