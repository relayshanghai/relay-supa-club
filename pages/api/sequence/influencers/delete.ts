import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getSequenceEmailsBySequenceInfluencersCall } from 'src/utils/api/db/calls/sequence-emails';
import { deleteSequenceInfluencersCall } from 'src/utils/api/db/calls/sequence-influencers';
import { getOutbox, deleteEmailFromOutbox } from 'src/utils/api/email-engine';
import { serverLogger } from 'src/utils/logger-server';
import { deleteJobs, getFailedOrPendingSequenceSendJobs } from 'src/utils/scheduler/db-queries';
import { db } from 'src/utils/supabase-client';
import { isString } from 'src/utils/types';

export type SequenceInfluencersDeleteRequestBody = {
    ids: string[];
};
type SequenceInfluencersDeleteResults = {
    [sequenceInfluencerId: string]: {
        emailsDeleted: number;
        outboxMessagesCanceled: number;
    };
};
export type SequenceInfluencersDeleteResponse = SequenceInfluencersDeleteResults;

/** Also deletes any associated emails, and cancels sending them from the outbox */
const deleteSequenceInfluencers = async (ids: string[]) => {
    const emails = await db(getSequenceEmailsBySequenceInfluencersCall)(ids); // must be called before the deleteSequenceInfluencersCall because it deletes the emails

    let jobIds = emails.map((email) => email.job_id).filter(isString);
    if (jobIds.length === 0) {
        // if the job failed before sending the email, there could be no sequence_email rows, so we need to get the job ids from the scheduler json payload.
        const { data: allJobs } = await db(getFailedOrPendingSequenceSendJobs)();
        jobIds = allJobs
            ? allJobs
                  .filter(
                      (job) =>
                          // because this is a JSON type, we need a lot of type checks.
                          job.payload &&
                          typeof job.payload === 'object' &&
                          'sequenceInfluencer' in job.payload &&
                          job.payload.sequenceInfluencer &&
                          typeof job.payload.sequenceInfluencer === 'object' &&
                          'id' in job.payload.sequenceInfluencer &&
                          typeof job.payload.sequenceInfluencer.id === 'string' &&
                          ids.includes(job.payload.sequenceInfluencer.id),
                  )
                  .map((job) => job.id)
            : [];
    }
    if (jobIds.length > 0) {
        const { error: deleteJobsError } = await db(deleteJobs)(jobIds); // delete any pending jobs from the scheduler
        if (deleteJobsError) {
            serverLogger(deleteJobsError);
        }
    }

    await db(deleteSequenceInfluencersCall)(ids); // this cascade deletes the emails as well. Try to do this call as soon as possible otherwise the user could refresh the page and the influencer will still be there

    const outbox = await getOutbox(); // then the slow part
    for (const email of emails) {
        const outboxMessage = outbox.find((e) => e.messageId === email.email_message_id);
        if (outboxMessage) {
            try {
                await deleteEmailFromOutbox(outboxMessage.queueId);
            } catch (error) {
                serverLogger(error);
            }
        }
    }

    return {};
};

const postHandler: NextApiHandler = async (req, res) => {
    const { ids } = req.body as SequenceInfluencersDeleteRequestBody;
    if (!ids) return res.status(httpCodes.BAD_REQUEST).json({});
    const results: SequenceInfluencersDeleteResponse = await deleteSequenceInfluencers(ids);
    return res.status(httpCodes.OK).json(results);
};
export default ApiHandler({ postHandler });
