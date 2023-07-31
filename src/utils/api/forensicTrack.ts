import { serverLogger } from '../logger-server';
import type { ServerContext } from './iqdata';

export const forensicTrack = (context: ServerContext, caller?: string) => {
    const sentryPayload = {
        metadata: context.metadata,
        caller,
    };
    serverLogger(sentryPayload, 'error', true);
};
