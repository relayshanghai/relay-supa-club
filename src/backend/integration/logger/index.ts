import { RequestContext } from 'src/utils/request-context/request-context';
import { createLogger, type Logger, format, transports } from 'winston';
const logContext = format((info) => {
    const context = RequestContext.getContext();
    if (context) {
        info.contextMap = context.logContext;
        info.user = context.profile;
    }
    info.meta = info[Symbol.for('splat') as any];

    return info;
});

export const logger: Logger = createLogger({
    format: format.combine(logContext(), format.json()),
    defaultMeta: {},
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new transports.Console({
            format: format.json(),
        }),
    ],
});

export const setLogContext = <T>(key: string, value: T) => {
    const context = RequestContext.getContext();
    if (!context) return;
    context.logContext = context.logContext || {};
    context.logContext[key] = value;
    RequestContext.setContext({ logContext: context.logContext });
};
