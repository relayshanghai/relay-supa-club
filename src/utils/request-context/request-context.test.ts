import type { Session } from '@supabase/supabase-js';
import awaitToError from '../await-to-error';
import { RequestContext } from './request-context';
import { describe, expect, it } from 'vitest';

describe('src/common/request-context.ts', () => {
    describe('startContext()', () => {
        it(`should start a new context request flow when function triggered`, async () => {
            const data = await RequestContext.startContext(async () => {
                const contextData = RequestContext.asyncLocalStorage.getStore();
                expect(contextData).not.to.be.undefined;
                return 'passed context';
            });
            expect(data).to.be.eq('passed context');
        });
    });
    describe('setContext()', () => {
        async function notContext() {
            RequestContext.setContext({
                session: {
                    user: {
                        id: 'some-id',
                    },
                } as Session,
            });
            return true;
        }
        it(`should throw error when set context triggered outside request context flow`, async () => {
            const [err, result] = await awaitToError(notContext());
            expect(result).to.be.null;
            expect(err).not.to.be.null;
            expect(err.message).to.be.eq('no active context');
        });
        it(`should success when set context triggered inside request context flow`, async () => {
            const contexted = RequestContext.startContext(notContext);
            const [err, result] = await awaitToError(contexted);
            expect(result).to.be.true;
            expect(err).to.be.null;
        });
    });
    describe('getContext()', () => {
        async function notContext() {
            RequestContext.setContext({
                session: {
                    user: {
                        id: 'some-id',
                    },
                } as Session,
            });
            return true;
        }
        it(`should return empty object when get context triggered outside request context flow`, async () => {
            async function anotherFunction() {
                await notContext();
                const contextValue = RequestContext.getContext();
                expect(contextValue).to.be.equal({});
            }
            await awaitToError(anotherFunction());
        });
        it(`should return context value when get context triggered inside request context flow`, async () => {
            async function anotherFunction() {
                await notContext();
                const contextValue = RequestContext.getContext();
                expect(contextValue.session?.user.id).to.be.equal('some-id');
            }
            await awaitToError(RequestContext.startContext(anotherFunction));
        });
    });
});
