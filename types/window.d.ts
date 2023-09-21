import type rudderSDK from 'rudder-sdk-js';
import type { TestMountOptions } from '../src/utils/user-test-wrapper.tsx';
import type { CompanyDB, ProfileDB } from 'src/utils/api/db/types.js';

declare global {
    interface Window {
        rudder: Omit<typeof rudderSDK, 'RESIDENCY_SERVER'>;
        session?: {
            profile: ProfileDB;
            company: CompanyDB;
        };
        setMockRouter: (options: TestMountOptions) => void;
        useRouter: () => {
            route: string;
            pathname: string;
            query: Record<string, string>;
            asPath: string;
            push: (path: string) => void;
        };
    }
}
