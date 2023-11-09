import { Foo } from './foo';

export const jobs = {
    [Foo.name]: Foo,
};

export type JobNames = keyof typeof jobs;

export const isValidJob = (name: string): name is JobNames => {
    return name in jobs;
};

export const runJob = (name: string, payload?: any) => {
    if (isValidJob(name)) {
        return jobs[name].run(payload);
    }

    throw new Error(`Invalid Job: ${name}`);
};
