import { serverLogger } from '../logger-server';
import callsites from 'callsites';
import type { ServerContext } from './iqdata';

export const forensicTrack = async (context: ServerContext, caller?: string) => {
    const calls = await callsites();
    const trace = calls.map((call) => {
        return call.getFunctionName();
    });

    const sentryPayload = {
        metadata: context.metadata,
        caller,
        trace,
    };
    serverLogger(sentryPayload, 'error', true);
};
