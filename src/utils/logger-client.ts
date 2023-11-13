import type { CaptureContext, LogLevel } from './logger-server';
import { serverLogger } from './logger-server';

export const clientLogger = (message: unknown, captureContext?: LogLevel | CaptureContext, _?: any) =>
    serverLogger(message, captureContext);
