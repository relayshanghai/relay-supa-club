import type { WindowCypress } from 'src/utils/cypress-app-wrapper.tsx';
import type { WindowSession } from 'src/hooks/use-session.tsx';
import type { WindowBirdEatsBug } from 'src/components/analytics/bird-eats-bugs.ts';
import type { WindowChatwoot } from 'src/utils/chatwoot/types.ts';
import type { WindowRudderstack } from 'src/hooks/use-rudderstack.ts';
declare global {
    interface Window extends WindowChatwoot, WindowBirdEatsBug, WindowSession, WindowRudderstack, WindowCypress {
        /**
         * Mixpanel
         * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mixpanel-browser/index.d.ts#L141
         */
        mixpanel: any;
        Appcues: any;
    }
}
