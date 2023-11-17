import type { JobInterface } from '../types';

export const Foo: JobInterface<'Foo'> = {
    name: 'Foo',
    run: async (payload) => {
        return { result: payload };
    },
};
