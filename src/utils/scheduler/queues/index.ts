import { Default } from './default';
import { Failed } from './failed';
import { Blocking } from './blocking';
import { Analytics } from './analytics';
import { SequenceSend } from './sequence-send';
import { SequenceStepSend } from './sequence-step-send';

export const queues = {
    [Default.name]: Default,
    [Failed.name]: Failed,
    [Blocking.name]: Blocking,
    [Analytics.name]: Analytics,
    [SequenceSend.name]: SequenceSend,
    [SequenceStepSend.name]: SequenceStepSend,
};

export type JOB_QUEUE = keyof typeof queues;

export const isValidJobQueue = (name: string | number): name is JOB_QUEUE => {
    return name in queues;
};

export const initQueue = (name: string) => {
    if (isValidJobQueue(name)) {
        return queues[name];
    }

    throw new Error(`Invalid Job Queue: ${name}`);
};
