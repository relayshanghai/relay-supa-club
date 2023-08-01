import { serverLogger } from '../logger-server';
import callsites from 'callsites';
import type { ServerContext } from './iqdata';

export const forensicTrack = async (_context: ServerContext, _caller?: string) => {
    const calls = await callsites();
    const sentryPayload = calls.map((call) => {
        return {
            evalOrigin: call.getEvalOrigin(),
            lineNumber: call.getLineNumber(),
            columnNumber: call.getColumnNumber(),
            fileName: call.getFileName(),
            functionName: call.getFunctionName(),
            function: call.getFunction(),
            method: call.getMethodName(),
            this: call.getThis(),
            typename: call.getTypeName(),
            isConstructor: call.isConstructor(),
            isEval: call.isEval(),
            isNative: call.isNative(),
            isToplevel: call.isToplevel(),
        };
    });

    serverLogger(sentryPayload, 'error', true);
};
