import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { SequenceEmail } from 'src/utils/api/db';
import type { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';

const DAYS_BEFORE_MARKING_AS_IGNORED = 14;

const DAY_IN_MS = 1000 * 60 * 60 * 24;

/**
 * checks the "In Sequence" influencers to see if their last email was more than 14 days ago. If so, updates them to ignored
 */
export const checkForIgnoredEmails = async ({
    sequenceInfluencer,
    lastEmail,
    updateSequenceInfluencer,
}: {
    sequenceInfluencer?: SequenceInfluencerManagerPage | null;
    lastEmail?: SequenceEmail | null;
    updateSequenceInfluencer: ReturnType<typeof updateSequenceInfluencerCall>;
}) => {
    if (!sequenceInfluencer || !lastEmail) {
        return null;
    }
    if (sequenceInfluencer.funnel_status !== 'In Sequence') {
        return null;
    }
    const lastSendDateRaw = lastEmail.email_send_at;
    if (!lastSendDateRaw) {
        return null;
    }
    const lastSendDate = new Date(lastSendDateRaw);

    const today = new Date();
    const daysSinceLastEmail = Math.floor((today.getTime() - lastSendDate.getTime()) / DAY_IN_MS);

    if (daysSinceLastEmail > DAYS_BEFORE_MARKING_AS_IGNORED) {
        return await updateSequenceInfluencer({
            id: sequenceInfluencer.id,
            funnel_status: 'Ignored',
        });
    }
    return null;
};
