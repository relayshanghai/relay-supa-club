import type rudderSDK from 'rudder-sdk-js';
import type { TestMountOptions } from '../src/utils/user-test-wrapper.tsx';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db/types.js';
import type { SubscriptionGetResponse } from 'pages/api/subscriptions/index.js';
import type { BEGSDKOptions } from 'src/components/analytics/bird-eats-bugs.ts';

declare global {
    interface Window {
        rudder: Omit<typeof rudderSDK, 'RESIDENCY_SERVER'>;
        /**
         * Mixpanel
         * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mixpanel-browser/index.d.ts#L141
         */
        mixpanel: any;
        session?: {
            user: any;
            profile: ProfileDB;
            company: CompanyDB;
            subscription: SubscriptionGetResponse;
        };
        setMockRouter: (options: TestMountOptions) => void;
        useRouter: () => {
            route: string;
            pathname: string;
            query: Record<string, string>;
            asPath: string;
            push: (path: string) => void;
        };
        Appcues: any;
        birdeatsbug?: {
            setOptions: (options: BEGSDKOptions) => void;
        };
    }
}
