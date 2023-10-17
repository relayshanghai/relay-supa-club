import type { Session } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import type { AnalyticsInstance, AnalyticsPlugin } from 'analytics';
import { Analytics } from 'analytics';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { profileToIdentifiable, useRudder } from 'src/hooks/use-rudderstack';
import { useSession } from 'src/hooks/use-session';
import { createTrack } from 'src/utils/analytics/analytics';
import { AnalyticsProvider as BaseAnalyticsProvider } from 'use-analytics';
import { SupabasePlugin } from '../../utils/analytics/plugins/analytics-plugin-supabase';
import { useAppcues } from 'src/hooks/useAppcues';
import { useTranslation } from 'react-i18next';

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

    const rudderstack = useRudder();
    const appcues = useAppcues();
    const { session, profile, user, company, subscription } = useSession();
    const { i18n } = useTranslation();
    const [analytics] = useState(() => initAnalytics([SupabasePlugin({ client })]));
    const [track] = useState(() => createTrack(analytics));

    useEffect(() => {
        if (profile !== null && user !== null && company !== null && subscription && rudderstack) {
            const { id, traits } = profileToIdentifiable(profile, company, user, i18n.language, subscription);
            rudderstack.identify(id, traits);
        }
    }, [rudderstack, profile, user, company, i18n, subscription]);

    useEffect(() => {
        if (profile !== null && user !== null && company !== null && subscription && appcues) {
            const { id, traits } = profileToIdentifiable(profile, company, user, i18n.language, subscription);
            appcues.identify(id, traits);
        }
    }, [appcues, profile, user, company, i18n, subscription]);

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
