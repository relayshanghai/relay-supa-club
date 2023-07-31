import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';
import type { SequenceInfluencer } from 'src/utils/api/db';
import { useSequenceSteps } from './use-sequence_steps';
import { sendEmail } from 'src/utils/api/email-engine/send-email';
import { useSequenceInfluencers } from './use-sequence_influencers';

export const useSequence = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequence, mutate: refreshSequences } = useSWR(
        sequenceId ? [sequenceId, 'sequences'] : null,
        ([sequenceId]) => db.getSequenceById(sequenceId),
    );
    const { sequenceSteps, updateSequenceStep } = useSequenceSteps(sequence?.id);
    const { updateSequenceInfluencer } = useSequenceInfluencers(sequenceId);

    /** TODO: move 'send sequence' to the sever, because the emails need to be sent sequentially, not in parallel, so if the user navigates away it could cause some emails to be unsent. */
    const sendSequence = async (account: string, influencer: SequenceInfluencer, params: Record<string, string>) => {
        const results = [];
        if (!sequenceSteps || !influencer.email) {
            return;
        }
        for (const step of sequenceSteps) {
            //add the step's waitTimeHrs to the sendAt date
            const sendAt = new Date();
            sendAt.setHours(sendAt.getHours() + step.wait_time_hours);
            const emailSendAt = sendAt.toISOString();
            const { template_id } = step;
            const res = await sendEmail(account, influencer.email, template_id, emailSendAt, params);

            updateSequenceStep({ ...step, email_send_at: emailSendAt, email_delivery_status: 'Scheduled' });
            updateSequenceInfluencer({ ...influencer, funnel_status: 'In Sequence', sequence_step: step.step_number });

            results.push({
                ...res,
                ...influencer,
                sendAt,
            });
        }
        return results;
    };

    return {
        sequence,
        refreshSequences,
        sendSequence,
    };
};
