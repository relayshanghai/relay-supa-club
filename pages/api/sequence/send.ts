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

export type SequenceSendPostBody = {
    account: string;
    sequenceInfluencers: SequenceInfluencerManagerPage[];
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
};

export type SendResult = { stepNumber?: number; sequenceInfluencerId?: string; error?: string };

export type SequenceSendPostResponse = SendResult[];

const postHandler: NextApiHandler = async (req, res) => {
    await rudderstack.identify({ req, res });
    const { account, sequenceInfluencers, sequenceSteps, templateVariables } = req.body as SequenceSendPostBody;
    const results: SequenceSendPostResponse = [];
    // optimistic updates
    for (const influencer of sequenceInfluencers) {
        try {
            await wait(100);
            await db(updateSequenceInfluencerCall)({
                id: influencer.id,
                funnel_status: 'In Sequence',
            });
        } catch (error) {
            serverLogger(error);
        }
    }
    for (const influencer of sequenceInfluencers) {
        const payload = {
            emailEngineAccountId: account,
            sequenceInfluencer: influencer,
            sequenceSteps,
            templateVariables,
        };
        const jobCreated = await createJob('sequence_send', {
            queue: 'sequence_send',
            payload,
        });
        if (jobCreated && jobCreated.id) {
            // TODO: make better https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1100
            // Now that we use the scheduler, it is hard to know which sequence step failed, so we just do it per influencer
            results.concat([
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
            ]);
        } else {
            results.concat([
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
            ]);
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
