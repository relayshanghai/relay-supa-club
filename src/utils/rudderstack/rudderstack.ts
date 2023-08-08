import Analytics from '@rudderstack/rudder-sdk-node';
import type { constructorOptions } from '@rudderstack/rudder-sdk-node';
import type { ServerContext } from '../api/iqdata';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import { getUserSession } from '../api/analytics';
import type { z } from 'zod';
import type { eventKeys } from '.';
import { serverLogger } from '../logger-server';
const disabled = process.env.NEXT_PUBLIC_CI === 'true' || process.env.NEXT_PUBLIC_DISABLE_RUDDERSTACK === 'true';

export type RudderBackend = Analytics;

export type EventParameters<P = any> = P & Omit<Parameters<RudderBackend['track']>[0], 'event'>;

export type RudderIdentifier = {
    userId?: string;
    anonymousId?: string;
};

export const createClient = (writeKey?: string, dataPlane?: string, options?: constructorOptions): RudderBackend =>
    new Analytics(writeKey ?? process.env.RUDDERSTACK_APP_WRITE_KEY ?? '', {
        dataPlaneUrl: dataPlane ?? process.env.RUDDERSTACK_APP_DATA_PLANE_URL,
        ...options,
    });

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

    session: Awaited<ReturnType<ReturnType<typeof getUserSession>>> | null = null;

    context: RudderstackContext | null = null;

    getClient(writeKey?: string, dataPlaneUrl?: string, options?: constructorOptions): RudderBackend {
        if (this[client] === null) {
            this[client] = createClient(writeKey, dataPlaneUrl, options);
        }

        return this[client];
    }

    /**
     * @todo put in (server-side) middleware
     */
    async identify(context: ServerContext) {
        if (this.session || disabled) return;

        const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
        const session = await getUserSession(supabase)();

        this.getClient().identify({
            userId: session.user_id,
        });

        this.session = session;
        this.serverContext = context;
    }

    // @todo support multiple tracking
    track(params: RudderstackContext) {
        if (disabled) return;

        if (this.context && this.context.event !== params.event) {
            serverLogger(
                `Cannot track "${params.event}" event. Already tracking event: ${this.context.event}`,
                'error',
                true,
            );
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

    getContext() {
        return this.context;
    }

    async send(payload?: ServerContext['metadata']) {
        if (this.session === null || this.serverContext === null || this.context === null) {
            return;
        }

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

        this.getClient().track(
            {
                userId: this.session.user_id,
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
