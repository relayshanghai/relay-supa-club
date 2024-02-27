import * as UUID from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import type { Session } from '@supabase/supabase-js';
import awaitToError from '../await-to-error';
import type { NextApiRequest } from 'next';
export type TranslationFunction = (key: string, params?: Record<string, string>) => string;
export interface Context {
    session?: Session | null;
    customerId?: string | null;
    companyId?: string | null;
    request?: NextApiRequest;
    requestUrl: string;
    translation: TranslationFunction;
}
const initialContext = (): Context => ({
    session: undefined,
    requestUrl: '',
    translation: () => '',
});
export class RequestContext {
    static contextMap: Map<string, Context> = new Map();
    static asyncLocalStorage = new AsyncLocalStorage<string>();
    static async startContext<T>(handler: () => void | Promise<T>) {
        const contextId = UUID.v4();
        RequestContext.contextMap.set(contextId, initialContext());
        const [err, res] = await awaitToError(RequestContext.asyncLocalStorage.run(contextId, handler) as Promise<T>);
        RequestContext.contextMap.delete(contextId);
        if (err) throw err;
        return res as T;
    }
    static t(key: string, params?: Record<string, string>): string {
        return RequestContext.getContext().translation(key, params);
    }
    static getContext(): Context {
        const id = RequestContext.asyncLocalStorage.getStore();
        if (!id) {
            return initialContext();
        }
        return RequestContext.contextMap.get(id) || initialContext();
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
