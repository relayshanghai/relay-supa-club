import * as UUID from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import type { Session } from '@supabase/supabase-js';
import awaitToError from '../await-to-error';
import type { NextApiRequest } from 'next';

export interface Context {
    session?: Session | null;
    customerId?: string | null;
    companyId?: string | null;
    request?: NextApiRequest;
}
export class RequestContext {
    static contextMap: Map<string, Context> = new Map();
    static asyncLocalStorage = new AsyncLocalStorage<string>();
    static async startContext<T>(handler: () => void | Promise<T>) {
        const contextId = UUID.v4();
        const initialContext: Context = {
            session: undefined,
        };
        RequestContext.contextMap.set(contextId, initialContext);
        const [err, res] = await awaitToError(RequestContext.asyncLocalStorage.run(contextId, handler) as Promise<T>);
        RequestContext.contextMap.delete(contextId);
        if (err) throw err;
        return res as T;
    }
    static getContext(): Context {
        const id = RequestContext.asyncLocalStorage.getStore();
        if (!id) {
            return {};
        }
        return RequestContext.contextMap.get(id) || {};
    }
    static setContext(data: Partial<Context>): void {
        const id = RequestContext.asyncLocalStorage.getStore();

        if (!id) {
            throw new Error('no active context');
        }
        const context = RequestContext.getContext();
        RequestContext.contextMap.set(id, {
            ...context,
            ...data,
        });
    }
}
