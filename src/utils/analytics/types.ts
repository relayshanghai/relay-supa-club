import type { AnalyticsPlugin } from 'analytics';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { timestamp } from '../datetime';
import type { eventKeys, payloads } from './events';

export type AnalyticsEventParam<T = any> = {
    abort: () => void;
    config: any;
    plugins: AnalyticsPlugin[];
    payload: {
        type: string;
        meta: any;
        anonymousId: string;
        userId: string;
        event: string;
        options: any;
        properties: T;
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

export enum JourneyStatus {
    ONGOING = 'ongoing',
    ENDED = 'ended',
    ABORTED = 'aborted',
}

export const JourneyStatusEnum = z.nativeEnum(JourneyStatus);

export type JourneyObject = {
    id: string;
    name: string;
    status: JourneyStatus;
    created_at?: number;
    updated_at?: number;
    tag?: string;
};

export const JourneyObject = z.object({
    id: z.string(),
    name: z.string(),
    status: JourneyStatusEnum.optional(),
    created_at: z.number().optional().default(timestamp),
    updated_at: z.number().optional().default(timestamp),
    tag: z.string().optional(),
});

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

export type JourneyCollection = {
    [key: string]: (args?: any) => Journey;
};

/**
 * The Server Context contains a request and response
 */
export type ServerContext = { req: NextApiRequest; res: NextApiResponse };

/**
 * Callback function that is called inside a tracked event
 */
export type TriggerEvent<P = any, R = any> = (eventName: eventKeys, payload?: P) => R;

/**
 * Event function that contains eventName property
 */
export type TrackedEvent = {
    <T extends TriggerEvent>(trigger: T, payload: Parameters<T>[1]): ReturnType<T>;
    eventName: eventKeys;
};

/**
 * Event payload that optionally expects an event_at property
 */
export type EventPayload<T = { [key: string]: any }> = { event_at?: string } & T;

/**
 * Signature for functions that would want to track an event
 */
export type TrackEvent = <E extends TrackedEvent>(event: E, payload: payloads[E['eventName']]) => any;
