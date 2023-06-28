import { useSessionContext } from '@supabase/auth-helpers-react';
import { Analytics } from 'analytics';
import type { AnalyticsPlugin } from 'analytics';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AnalyticsProvider as BaseAnalyticsProvider } from 'use-analytics';

type SupabasePluginConfig = any;

type AnalyticsEventParam = {
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

const SupabasePlugin = (config: SupabasePluginConfig = {}): AnalyticsPlugin => {
    return {
        name: 'supabase',
        config,
        initializeStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('initializeStart', args.payload);
        },
        ready: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('ready', args.instance.user());
        },
        identifyStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('identifyStart', args.payload);
        },
        resetStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('resetStart', args.payload);
        },
    };
};

const initAnalytics = (plugins?: AnalyticsPlugin[]) =>
    Analytics({
        app: 'relay-club',
        plugins: plugins,
    });

type AnalyticsProviderProps = PropsWithChildren;

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
    const { supabaseClient: client } = useSessionContext();

    // @note useUser is always rerendering
    // const user = useUser();

    const [analytics] = useState(() => initAnalytics([SupabasePlugin({ client })]));

    useEffect(() => {
        const getUser = async () => {
            const { data } = await client.auth.getUser();

            if (data.user) {
                analytics.identify(data.user.id);
            }
        };

        getUser();
    }, [client, analytics]);

    return <BaseAnalyticsProvider instance={analytics}>{children}</BaseAnalyticsProvider>;
};
