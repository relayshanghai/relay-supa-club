import type { constructorOptions } from '@rudderstack/rudder-sdk-node';
import Analytics from '@rudderstack/rudder-sdk-node';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { z } from 'zod';
import type { eventKeys } from '.';
import type { TrackEvent, TriggerEvent } from '../analytics/types';
import { getUserSession } from '../api/analytics';
import type { ServerContext } from '../api/iqdata';
import { serverLogger } from '../logger-server';
const disabled = process.env.NEXT_PUBLIC_ENABLE_RUDDERSTACK !== 'true';

export type RudderBackend = Analytics;

export type EventParameters<P = any> = P & Omit<Parameters<RudderBackend['track']>[0], 'event'>;

export type RudderIdentifier = {
    userId?: string;
    anonymousId?: string;
};

export const createClient = (
    writeKey?: string,
    dataPlane?: string,
    options?: constructorOptions,
): RudderBackend | null => {
    try {
        return new Analytics(writeKey ?? process.env.RUDDERSTACK_APP_WRITE_KEY ?? '', {
            dataPlaneUrl: dataPlane ?? process.env.RUDDERSTACK_APP_DATA_PLANE_URL,
            ...options,
        });
    } catch (error) {
        serverLogger('Cannot instantiate Rudderstack', (scope) => {
            return scope.setContext('Error', {
                error,
            });
        });
    }

    return null;
};

type TrackFuncType = (r: RudderBackend | null, u: (typeof Rudderstack.prototype)['session']) => TrackEvent;

/**
 * Track function that supports events in /src/utils/analytic/events
 * @note ideally, we will move all tracking events there
 */
export const track: TrackFuncType = (rudder, session) => (event, payload) => {
    if (!rudder || disabled) return false;

    const trigger: TriggerEvent = (eventName, payload) => {
        if (!session) {
            throw new Error(`Rudderstack event "${eventName}" has no session`);
        }

        const trackPayload: Parameters<typeof rudder.track>[0] = {
            event: eventName,
            properties: payload,
        };

        if (session.user_id) {
            trackPayload.userId = session.user_id;
        }

        if (session.anonymous_id) {
            trackPayload.anonymousId = session.anonymous_id;
        }

        if (!trackPayload.userId && !trackPayload.anonymousId) {
            throw new Error(`Rudderstack event "${eventName}" has no identity`);
        }

        rudder.track(trackPayload);
    };

    try {
        event(trigger, payload);
        return true;
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext(`Event`, { eventName: event.eventName });
        });
    }

    return false;
};

const client = Symbol('Rudderstack Client');

type RudderstackContext = {
    /**
     * The event name
     */
    event: z.infer<typeof eventKeys>;
    /**
     * Callback before sending the event. Receives the payload passed on `send()`
     *
     * Returning `false` will prevent from tracking
     */
    onTrack?: (payload: {
        [key: string]: any;
        server_context: ServerContext;
    }) => Promise<{ [key: string]: any }> | { [key: string]: any } | false;
    /**
     * Callback after sending the event. Receives the initial payload passed on `track()` and the payload passed on `send()`
     */
    onDone?: (payload: { [key: string]: any; server_context: ServerContext }) => any;
    /**
     * The initial payload before sending the event
     */
    payload?: { [key: string]: any };
    /**
     * Test tracking
     */
    dryRun?: boolean;
};

export class Rudderstack {
    [client]: RudderBackend | null = null;

    serverContext: ServerContext | null = null;

    session: (Awaited<ReturnType<ReturnType<typeof getUserSession>>> & { anonymous_id?: string }) | null = null;

    context: RudderstackContext | null = null;

    getClient(writeKey?: string, dataPlaneUrl?: string, options?: constructorOptions): RudderBackend | null {
        if (this[client] === null) {
            this[client] = createClient(writeKey, dataPlaneUrl, options);
        }

        return this[client];
    }

    /**
     * Identifies the current user for the incoming event to be tracked
     * @todo put in (server-side) middleware
     * @todo decouple from supabase
     */
    async identify(context: ServerContext) {
        try {
            if (this.session || disabled) return;

            const client = this.getClient();
            if (!client) return;

            const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
            const session = await getUserSession(supabase)();

            client.identify({
                userId: session.user_id,
            });

            this.session = session;
            this.serverContext = context;
        } catch (error) {
            serverLogger(error);
        }
    }

    async identifyWithProfile(userId: string) {
        const client = this.getClient();
        if (!client) return;

        this.session = this.session ?? {};
        this.session['user_id'] = userId;

        client.identify({
            userId,
            anonymousId: this.session.anonymous_id,
        });

        return this.session;
    }

    async identifyWithAnonymousID(anonymousId: string) {
        const client = this.getClient();
        if (!client) return;

        this.session = this.session ?? {};
        this.session['anonymous_id'] = anonymousId;

        client.identify({
            userId: this.session.user_id,
            anonymousId,
        });

        return this.session;
    }

    getIdentity() {
        return this.session;
    }

    /**
     * Starts tracking an event
     * @todo support multiple tracking
     */
    track(params: RudderstackContext) {
        if (disabled) return;

        if (this.context && this.context.event !== params.event) {
            serverLogger(`Cannot track "${params.event}" event. Already tracking event: ${this.context.event}`, 'log');
            return;
        }

        if (this.context && this.context.event === params.event) {
            this.context.payload = { ...this.context.payload, ...params.payload };
            return;
        }

        if (params.dryRun) {
            // eslint-disable-next-line no-console
            console.log(`Start tracking: ${params.event}`);
        }

        this.context = params;
    }

    /**
     * Sends the tracked event to rudderstaack
     */
    async send(payload?: ServerContext['metadata']) {
        if (this.session === null || this.serverContext === null || this.context === null) {
            return;
        }

        const client = this.getClient();
        if (!client) return;

        const context = { ...this.context };
        this.context = null;

        const extra =
            context.onTrack && payload
                ? await context.onTrack({ ...payload, server_context: this.serverContext })
                : null;

        if (extra === false) {
            if (context.dryRun) {
                // eslint-disable-next-line no-console
                console.log(`[Rudderstack]: Event ${context.event} dropped!`);
            }

            return;
        }

        const onDone = () => {
            if (context && this.serverContext && context.dryRun) {
                // eslint-disable-next-line no-console
                console.log(`[Rudderstack]: Event ${context.event} sent!`, {
                    context_payload: context.payload,
                    onTrack_payload: extra,
                    server_context_metadata: this.serverContext.metadata,
                });
            }

            if (this.serverContext && context && context.onDone) {
                context.onDone({ ...(context.payload ?? {}), ...extra, server_context: this.serverContext });
            }
        };

        if (context.dryRun) {
            onDone();
            return;
        }

        client.track(
            {
                userId: this.session.user_id,
                anonymousId: this.session.anonymous_id,
                event: context.event,
                properties: { ...(context.payload ?? {}), ...extra },
            },
            onDone,
        );
    }
}

/**
 * Singleton Rudderstack instance that can be used across modules
 *
 * Relies on Nodejs module caching. Breaks FP paradigm and might cause side-effects.
 * use this pattern sparingly
 */
export const rudderstack = new Rudderstack();
