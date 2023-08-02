import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';
import type {
    SequenceInfluencer,
    SequenceEmail,
    SequenceEmailUpdate,
    SequenceInfluencerUpdate,
    SequenceStep,
} from 'src/utils/api/db';
import { useSequenceSteps } from './use-sequence-steps';
import { sendEmail } from 'src/utils/api/email-engine/send-email';

export /** TODO: move this 'send sequence' to the sever, because the emails need to be sent sequentially, not in parallel, so if the user navigates away it could cause some emails to be unsent. */
const sendSequence = async ({
    account,
    sequenceInfluencer,
    params,
    sequenceEmails,
    sequenceSteps,
    updateSequenceEmail,
    updateSequenceInfluencer,
}: {
    account: string;
    sequenceInfluencer: SequenceInfluencer;
    params: Record<string, string>;
    sequenceEmails: SequenceEmail[];
    sequenceSteps: SequenceStep[];
    updateSequenceEmail: (update: SequenceEmailUpdate) => Promise<SequenceEmail>;
    updateSequenceInfluencer: (update: SequenceInfluencerUpdate) => Promise<SequenceInfluencer>;
}) => {
    const results = [];
    if (!sequenceSteps || !sequenceInfluencer.email) {
        return;
    }
    for (const step of sequenceSteps) {
        // add the step's waitTimeHrs to the sendAt date
        const sendAt = new Date();
        sendAt.setHours(sendAt.getHours() + step.wait_time_hours);
        const emailSendAt = sendAt.toISOString();
        const { template_id } = step;
        const res = await sendEmail(account, sequenceInfluencer.email, template_id, emailSendAt, params);

        results.push({
            ...res,
            ...sequenceInfluencer,
            sendAt,
        });
        if (!('error' in res)) {
            const sequenceEmail = sequenceEmails.find((sis) => sis.sequence_step_id === step.id);
            if (sequenceEmail) {
                updateSequenceEmail({
                    ...sequenceEmail,
                    email_send_at: emailSendAt,
                    email_delivery_status: 'Scheduled',
                    email_message_id: res.messageId,
                });
                updateSequenceInfluencer({
                    ...sequenceInfluencer,
                    funnel_status: 'In Sequence',
                    sequence_step: step.step_number,
                });
            } else {
                throw new Error('sequenceEmail not found');
            }
        }
    }

    return results;
};

export const useSequence = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequence, mutate: refreshSequences } = useSWR(
        sequenceId ? [sequenceId, 'sequences'] : null,
        ([sequenceId]) => db.getSequenceById(sequenceId),
    );
    const { sequenceSteps } = useSequenceSteps(sequence?.id);

    return {
        sequence,
        refreshSequences,
        sendSequence,
        sequenceSteps,
    };
};
