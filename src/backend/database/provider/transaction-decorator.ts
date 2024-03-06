import awaitToError from 'src/utils/await-to-error';
import { DatabaseProvider } from './database-provider';
import { RequestContext } from 'src/utils/request-context/request-context';

/**
 * Method decorator that wraps the method in a database transaction, all of the database operations inside the method will ignored when an error is thrown
 * @returns
 */
export const UseTransaction = (): MethodDecorator => {
    return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            // start a new context and set the manager to the query runner
            const parentContextData = RequestContext.getContext();
            return RequestContext.startContext(async () => {
                RequestContext.setContext(parentContextData);
                const runner = await DatabaseProvider.getDatasource().createQueryRunner();
                await runner.startTransaction();
                runner.manager;
                RequestContext.setManager(runner.manager);
                const [err, result] = await awaitToError(originalMethod.apply(this, args));
                if (err) await runner.rollbackTransaction();
                else await runner.commitTransaction();
                await runner.release();
                RequestContext.setManager();
                if (err) throw err;
                return result;
            });
        };
    };
};
