import { serverLogger } from '../logger-server';
import type { ServerContext } from './iqdata';

export const forensicTrack = (context: ServerContext) => {
    serverLogger(context);
};
