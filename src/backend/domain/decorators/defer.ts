import awaitToError from 'src/utils/await-to-error';
/**
 * defer decorator to handle async function with defer function to be called after the async function is done
 * @param fn function to be called after the async function is done
 * @returns
 */
export const Defer = (fn: (...args: any[]) => void | Promise<void>): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const [result, err] = await awaitToError(originalMethod.apply(this, args));
            await fn(result, err);
            if (err) throw err;
            return result;
        };
    };
};
