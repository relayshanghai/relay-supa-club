import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { rudderstack } from 'src/utils/rudderstack';
import { createJob } from 'src/utils/scheduler/utils';
import type { SequenceInfluencerManagerPage } from './influencers';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';
import { wait } from 'src/utils/utils';
import type { SequenceStep, TemplateVariable } from 'src/utils/api/db';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
import { getTemplateVariablesBySequenceIdCall } from 'src/utils/api/db/calls/template-variables';

import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
import { maxExecutionTime } from 'src/utils/max-execution-time';
import { SEQUENCE_STEP_SEND_QUEUE_NAME } from 'src/utils/scheduler/queues/sequence-step-send';

export type SequenceSendPostBody = {
    account: string;
    sequenceInfluencers: SequenceInfluencerManagerPage[];
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
};

export type SendResult = { stepNumber?: number; sequenceInfluencerId?: string; error?: string };

export type SequenceSendPostResponse = SendResult[];

/**
 * TODO: make better https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1100
 * Now that we use the scheduler, it is hard to know which sequence step failed, so we just do it per influencer
 */
const successResults = (influencer: SequenceInfluencerManagerPage) => [
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 0,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 1,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 2,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 3,
    },
];
const failedResults = (influencer: SequenceInfluencerManagerPage) => [
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 0,
        error: 'failed to schedule 0',
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 1,
        error: 'failed to schedule 1',
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 2,
        error: 'failed to schedule 2',
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 3,
        error: 'failed to schedule 3',
    },
];

const postHandler: NextApiHandler = async (req, res) => {
    await rudderstack.identify({ req, res });
    const { account, sequenceInfluencers } = req.body as SequenceSendPostBody;
    let { sequenceSteps, templateVariables } = req.body as SequenceSendPostBody;
    const results: SequenceSendPostResponse = [];
    if (sequenceInfluencers.length === 0) {
        throw new Error('No influencers found');
    }
    // optimistic updates
    for (const influencer of sequenceInfluencers) {
        try {
            await maxExecutionTime(
                db(updateSequenceInfluencerCall)({
                    id: influencer.id,
                    funnel_status: 'In Sequence',
                }),
                1000,
            );
            await wait(100);
        } catch (error) {
            serverLogger(error);
        }
    }
    if (!account) {
        throw new Error('Missing required account id');
    }
    const sequenceId = sequenceInfluencers[0].sequence_id ?? '';
    if (!sequenceSteps || sequenceSteps.length === 0) {
        sequenceSteps = (await db(getSequenceStepsBySequenceIdCall)(sequenceId)) ?? [];
    }
    sequenceSteps?.sort((a, b) => a.step_number - b.step_number);
    if (!sequenceSteps || sequenceSteps.length === 0) {
        throw new Error('No sequence steps found');
    }

    if (!templateVariables || templateVariables.length === 0) {
        templateVariables = await db(getTemplateVariablesBySequenceIdCall)(sequenceId);
    }

    if (!templateVariables || templateVariables.length === 0) {
        throw new Error('No template variables found');
    }

    for (const influencer of sequenceInfluencers) {
        // only sent the first step. Subsequent steps will be sent after from email-engine/webhook `handleSent`
        const firstStep = sequenceSteps.find((step) => step.step_number === 0);
        if (!firstStep) {
            throw new Error('No first step found');
        }
        const payload: SequenceStepSendArgs = {
            emailEngineAccountId: account,
            sequenceInfluencer: influencer,
            sequenceStep: firstStep,
            sequenceSteps,
            templateVariables,
        };
        const jobCreated = await createJob(SEQUENCE_STEP_SEND_QUEUE_NAME, {
            queue: SEQUENCE_STEP_SEND_QUEUE_NAME,
            payload,
        });
        if (jobCreated && jobCreated.id) {
            results.concat(successResults(influencer));
        } else {
            results.concat(failedResults(influencer));
            try {
                // revert optimistic update
                await db(updateSequenceInfluencerCall)({
                    id: influencer.id,
                    funnel_status: 'To Contact',
                });
            } catch (error) {
                serverLogger(error);
                results[results.length - 1].error =
                    results[results.length - 1].error + ' and failed to revert optimistic update';
            }
        }
    }

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({ postHandler });
