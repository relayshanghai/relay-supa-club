import type { Repository, ObjectLiteral } from 'typeorm';
import { DatabaseProvider } from './database-provider';
/**
 * these functions do not related to the database connection
 */
const excludeFunctions = ['createQueryBuilder', 'hasId', 'getId', 'create', 'merge', 'preload', 'recover', 'extend'];
/**
 * since we are using typeorm, we need to initialize the database before
 * any repository method is called. This decorator will inject the
 * initialize method to all repository methods.
 * @param target Repository class
 */
export const InjectInitializeDatabaseOnAllProps = <T extends ObjectLiteral>(target: typeof Repository<T>) => {
    const parentClass = Object.getPrototypeOf(target);
    if (parentClass.name) {
        InjectInitializeDatabaseOnAllProps(parentClass);
    }
    const properties = Object.getOwnPropertyDescriptors(target.prototype);
    for (const name of Object.keys(properties)) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
        const isMethod = descriptor?.value instanceof Function;
        if (!isMethod) continue;
        if (excludeFunctions.includes(name)) continue;
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            await DatabaseProvider.initialize();
            const result = await originalMethod.apply(this, args);
            return result;
        };
        Object.defineProperty(target.prototype, name, descriptor);
    }
};
