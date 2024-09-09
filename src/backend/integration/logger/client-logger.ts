import { createLogger, type Logger, format, transports } from 'winston';

export const logger: Logger = createLogger({
    format: format.combine(format.json()),
    defaultMeta: {},
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new transports.Console({
            format: format.json(),
        }),
    ],
});
