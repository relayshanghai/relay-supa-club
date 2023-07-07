import type { Session } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import type { AnalyticsInstance, AnalyticsPlugin } from 'analytics';
import { Analytics } from 'analytics';
import type { PropsWithChildren } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AnalyticsProvider as BaseAnalyticsProvider } from 'use-analytics';
import { useSession } from 'src/hooks/use-session';
import { SupabasePlugin } from '../../utils/analytics/plugins/analytics-plugin-supabase';
import type { TrackedEvent } from 'src/utils/analytics/types';

const createTrack = (analytics: AnalyticsInstance) => (event: TrackedEvent, payload?: any) =>
    analytics.track(event.eventName, { event, payload });

export const AnalyticsContext = createContext<
    | {
          analytics: AnalyticsInstance;
          session: Session | null;
          track: ReturnType<typeof createTrack>;
      }
    | undefined
>(undefined);

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);

    if (context === undefined) {
        throw new Error('useAnalytics must be within AnalyticsProvider');
    }

    return context;
};

const initAnalytics = (plugins?: AnalyticsPlugin[]) =>
    Analytics({
        app: 'relay-club',
        plugins: plugins,
    });

type AnalyticsProviderProps = PropsWithChildren;

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
    const { supabaseClient: client } = useSessionContext();

    const { session } = useSession();

    const [analytics] = useState(() => initAnalytics([SupabasePlugin({ client })]));

    const [track] = useState(() => createTrack(analytics));

    // set analytics identity
    useEffect(() => {
        if (session !== null) {
            analytics.identify(session.user.id);
        }

        if (session === null) {
            // @todo do not reset since it clears anon id
            //       should we track users after logging out?
            // analytics.reset();
        }
    }, [session, analytics]);

    return (
        <BaseAnalyticsProvider instance={analytics}>
            <AnalyticsContext.Provider value={{ analytics, session, track }}>{children}</AnalyticsContext.Provider>
        </BaseAnalyticsProvider>
    );
};
