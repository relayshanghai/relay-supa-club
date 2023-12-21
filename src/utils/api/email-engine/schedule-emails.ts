import type { SequenceEmail, SequenceEmailInsert, SequenceStep } from '../db';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

const MAX_DAILY_PER_STEP = 25;

const jobsMicroserviceUrl = process.env.SCHEDULER_SERVER_URL || 'http://localhost:5005';

type ScheduleJobsBody = {
    sequenceSteps: SequenceStep[];
    scheduledEmails: Pick<SequenceEmail, 'email_send_at' | 'sequence_step_id'>[];
    influencer: SequenceInfluencerManagerPage;
    /** email engine account id */
    account: string;
    now?: Date;
    maxDailyPerStep?: number;
};
const scheduleEmailsFetch = async (body: ScheduleJobsBody) => {
    const res = await fetch(`${jobsMicroserviceUrl}/api/schedule-emails`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.status !== 200) {
        throw new Error(json.error);
    }
    return json;
};

export const scheduleEmails = async ({
    sequenceSteps,
    scheduledEmails,
    influencer,
    /** email engine account id */
    account,
    now = new Date(),
    maxDailyPerStep = MAX_DAILY_PER_STEP,
}: ScheduleJobsBody): Promise<{
    outreachStepInsert: SequenceEmailInsert;
    followupEmailInserts: SequenceEmailInsert[];
}> => {
    return await scheduleEmailsFetch({ sequenceSteps, scheduledEmails, influencer, account, now, maxDailyPerStep });
};
