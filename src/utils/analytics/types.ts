import { z } from 'zod';
import type { AnalyticsPlugin } from 'analytics';
import { timestamp } from '../datetime';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export type TriggerEvent = (eventName: string, payload?: any) => any;

export type TrackedEvent = {
    (trigger: TriggerEvent, payload?: any): any;
    eventName: string;
};
