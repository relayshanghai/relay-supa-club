import awaitToError from 'src/utils/await-to-error';
import { logger, setLogContext } from '.';
import { RequestContext } from 'src/utils/request-context/request-context';

export const UseLogger = (): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const profile = RequestContext.getContext().profile;
            setLogContext('profile', profile);
            const logMeta = {
                method: propertyKey,
                args,
                class: target.constructor.name,
            };
            logger.info(`start method execution`, logMeta);
            const [err, result] = await awaitToError(originalMethod.apply(this, args));
            if (err) {
                logger.error(`error method execution`, {
                    err: err,
                    stack: err.stack,
                    ...logMeta,
                });
                throw err;
            }
            logger.info(`finish method execution`, { result, ...logMeta });
            return result;
        };
    };
};
