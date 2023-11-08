import type { JobInterface } from '../types';

export const Foo: JobInterface = {
    name: 'test',
    run: async () => {
        return true;
    },
};
