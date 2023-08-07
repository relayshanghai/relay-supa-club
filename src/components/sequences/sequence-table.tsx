import type { SequenceInfluencer, SequenceEmail, SequenceStep } from 'src/utils/api/db';
import SequenceRow from './sequence-row';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencer[];
    allSequenceEmails?: SequenceEmail[];
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencer['funnel_status'];
}
const sortInfluencers = (currentTab: SequenceInfluencer['funnel_status'], influencers?: SequenceInfluencer[]) => {
    if (currentTab === 'To Contact') {
        influencers?.sort((a, b) => {
            // most recently created at the top
            return a.created_at < b.created_at ? -1 : 1;
        });
    }
    // TODO: sort by last email date in 'Ignored' tab https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/658
    // TODO: sort by previous message send date in 'In-Sequence' https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/654
    // We'll have to make a db call to check the associated email for each influencer. We already have to do this on the row level, so it is a bit inefficient to do it here as well. Later maybe we should pass down the email info from this parent instead.

    return influencers;
};
const SequenceTable: React.FC<SequenceTableProps> = ({ sequenceInfluencers, allSequenceEmails, sequenceSteps }) => {
    const sortedInfluencers = sortInfluencers('To Contact', sequenceInfluencers);

    return (
        <table className="border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border-b px-4 py-2">Name</th>
                    <th className="border-b px-4 py-2">Email</th>
                    <th className="border-b px-4 py-2">Sequence Step</th>
                    <th className="border-b px-4 py-2">Date added</th>
                    <th className="border-b px-4 py-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {sortedInfluencers?.map((influencer) => {
                    const step = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                    const sequenceEmail = allSequenceEmails?.find(
                        (email) =>
                            email.sequence_influencer_id === influencer.id && email.sequence_step_id === step?.id,
                    );

                    return (
                        <SequenceRow
                            key={influencer.id}
                            sequenceInfluencer={influencer}
                            sequenceEmail={sequenceEmail}
                        />
                    );
                })}
            </tbody>
        </table>
    );
};

export default SequenceTable;
