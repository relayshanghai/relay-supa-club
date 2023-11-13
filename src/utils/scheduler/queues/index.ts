import { Default } from './default';
import { Failed } from './failed';
import { Blocking } from './blocking';

export const queues = {
    [Default.name]: Default,
    [Failed.name]: Failed,
    [Blocking.name]: Blocking,
};

export type JOB_QUEUE = keyof typeof queues;

export const isValidJobQueue = (name: string | number): name is JOB_QUEUE => {
    return name in queues;
};

export const runQueue = (name: string) => {
    if (isValidJobQueue(name)) {
        return queues[name];
    }

    throw new Error(`Invalid Job Queue: ${name}`);
};
