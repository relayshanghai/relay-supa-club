import { Foo } from './foo';

const jobs = {
    [Foo.name]: Foo,
};

export const isValidJob = (name: string): name is keyof typeof jobs => {
    return name in Object.keys(jobs);
};

export const runJob = (name: string, payload?: any) => {
    if (isValidJob(name)) {
        return jobs[name].run(payload);
    }

    throw new Error(`Invalid Job: ${name}`);
};

export default jobs;
