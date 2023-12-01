import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { rudderstack } from 'src/utils/rudderstack';
import type { CreateJobInsert } from 'src/utils/scheduler/utils';
import { createJobs } from 'src/utils/scheduler/utils';
import type { SequenceInfluencerManagerPage } from './influencers';
import {
    updateSequenceInfluencerCall,
    upsertSequenceInfluencersFunnelStatusCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';
import type { SequenceInfluencerInsert, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import { getSequenceStepsBySequenceIdCall } from 'src/utils/api/db/calls/sequence-steps';
import { getTemplateVariablesBySequenceIdCall } from 'src/utils/api/db/calls/template-variables';

import type { SequenceStepSendArgs } from 'src/utils/scheduler/jobs/sequence-step-send';
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
const failedResults = (influencer: SequenceInfluencerManagerPage, error?: string) => [
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 0,
        error: `failed to schedule 0 ${error}`,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 1,
        error: `failed to schedule 1 ${error}`,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 2,
        error: `failed to schedule 2 ${error}`,
    },
    {
        sequenceInfluencerId: influencer.id,
        stepNumber: 3,
        error: `failed to schedule 3 ${error}`,
    },
];

const postHandler: NextApiHandler = async (req, res) => {
    await rudderstack.identify({ req, res });
    const { account, sequenceInfluencers } = req.body as SequenceSendPostBody;
    let { sequenceSteps, templateVariables } = req.body as SequenceSendPostBody;
    const results: SequenceSendPostResponse = [];

    const revertOptimisticUpdate = async (influencerId: string) => {
        try {
            await db(updateSequenceInfluencerCall)({
                id: influencerId,
                funnel_status: 'To Contact',
            });
        } catch (error) {
            serverLogger(error);
            results[results.length - 1].error =
                results[results.length - 1].error + ' and failed to revert optimistic update';
        }
    };

    if (sequenceInfluencers.length === 0) {
        throw new Error('No influencers found');
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
    // optimistic updates
    await db(upsertSequenceInfluencersFunnelStatusCall)(
        sequenceInfluencers.map(
            ({
                manager_first_name: _filterOut,
                address: _filterOut2,
                recent_post_title: _filterOut3,
                recent_post_url: _filterOut4,
                ...influencer
            }) => {
                const upsert: SequenceInfluencerInsert = {
                    ...influencer,
                    funnel_status: 'In Sequence',
                    name: influencer.name ?? '',
                    username: influencer.username ?? '',
                    avatar_url: influencer.avatar_url ?? '',
                    url: influencer.url ?? '',
                    platform: influencer.platform ?? '',
                };
                return upsert;
            },
        ),
    );

    const createJobsPayloads: CreateJobInsert<typeof SEQUENCE_STEP_SEND_QUEUE_NAME>[] = [];

    for (const influencer of sequenceInfluencers) {
        try {
            // only sent the first step. Subsequent steps will be sent after from email-engine/webhook `handleSent`
            const firstStep = sequenceSteps.find((step) => step.step_number === 0);
            if (!firstStep) {
                throw new Error('No sequence step found');
            }
            if (!influencer.influencer_social_profile_id) {
                throw new Error('No influencer social profile id');
            }
            if (!influencer.email) {
                throw new Error('No email address');
            }
            const influencerAccountName = influencer.name || influencer.username;
            if (!influencerAccountName) {
                throw new Error('No influencer name or handle');
            }
            const recentPostURL = influencer.recent_post_url;
            if (!recentPostURL) {
                throw new Error('No recent post url');
            }
            const payload: SequenceStepSendArgs = {
                emailEngineAccountId: account,
                sequenceInfluencer: influencer,
                sequenceStep: firstStep,
                sequenceSteps,
                templateVariables,
            };
            createJobsPayloads.push({ queue: SEQUENCE_STEP_SEND_QUEUE_NAME, payload });
        } catch (error: any) {
            serverLogger(error);
            await revertOptimisticUpdate(influencer.id);
            results.push(...failedResults(influencer, error?.message ?? ''));
        }
    }

    const createdJobs = await createJobs(SEQUENCE_STEP_SEND_QUEUE_NAME, createJobsPayloads);

    for (const influencer of sequenceInfluencers) {
        const createdJob = createdJobs?.find((job) => {
            const payload = job.payload as SequenceStepSendArgs;
            return payload?.sequenceInfluencer.id === influencer.id;
        });
        if (!createdJob) {
            await revertOptimisticUpdate(influencer.id);
            results.push(...failedResults(influencer, 'failed to create job'));
            continue;
        } else {
            results.push(...successResults(influencer));
        }
    }

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({ postHandler });
