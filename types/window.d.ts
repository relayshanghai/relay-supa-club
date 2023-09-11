import type rudderSDK from 'rudder-sdk-js';
import type { TestMountOptions } from '../src/utils/user-test-wrapper.tsx';

declare global {
    interface Window {
        rudder: Omit<typeof rudderSDK, 'RESIDENCY_SERVER'>;
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
