import type { Session } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import type { AnalyticsInstance, AnalyticsPlugin } from 'analytics';
import { Analytics } from 'analytics';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useIdentifySession, useSession } from 'src/hooks/use-session';
import { createTrack } from 'src/utils/analytics/analytics';
import { AnalyticsProvider as BaseAnalyticsProvider } from 'use-analytics';
import { SupabasePlugin } from '../../utils/analytics/plugins/analytics-plugin-supabase';
import * as Sentry from '@sentry/nextjs';
import { useBirdEatsBug } from './bird-eats-bugs';
import { nanoid } from 'nanoid';

export const AnalyticsContext = createContext<
    | {
          analytics: AnalyticsInstance;
          session: Session | null;
          track: ReturnType<typeof createTrack>;
      }
    | undefined
>(undefined);

export const useDeviceId = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const deviceId = urlParams.get('device_id');
            if (deviceId) {
                localStorage.setItem('deviceId', deviceId);
            } else {
                const existingDeviceId = localStorage.getItem('deviceId');
                if (!existingDeviceId) {
                    localStorage.setItem('deviceId', nanoid());
                }
            }
        }
    }, []);
};

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
    useBirdEatsBug();
    const { session, profile } = useSession();
    const { identifySession } = useIdentifySession();
    const [analytics] = useState(() => initAnalytics([SupabasePlugin({ client })]));
    const [track] = useState(() => createTrack(analytics));

    // identify the session if the user is logged in
    useEffect(() => {
        identifySession();
    }, [identifySession]);

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

    // set Sentry identity
    useEffect(() => {
        if (!profile) return;
        const user: Sentry.User = {
            id: profile.id,
            username: `${profile.first_name} ${profile.last_name}`,
        };
        // @note for some reason profile.email is nullable
        if (profile.email) {
            user.email = profile.email;
        }
        if (window.birdeatsbug?.setOptions) {
            window?.birdeatsbug?.setOptions({
                user: { email: profile.email || '' },
            });
        }
        Sentry.setUser(user);
    }, [profile]);

    return (
        <BaseAnalyticsProvider instance={analytics}>
            <AnalyticsContext.Provider value={{ analytics, session, track }}>{children}</AnalyticsContext.Provider>
        </BaseAnalyticsProvider>
    );
};
