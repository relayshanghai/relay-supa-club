import type { SequenceInfluencer, SequenceEmail, SequenceStep } from 'src/utils/api/db';
import SequenceRow from './sequence-row';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencer[];
    allSequenceEmails?: SequenceEmail[];
    sequenceSteps: SequenceStep[];
}

const SequenceTable: React.FC<SequenceTableProps> = ({ sequenceInfluencers, allSequenceEmails, sequenceSteps }) => {
    return (
        <table className="border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border-b px-4 py-2">Name</th>
                    <th className="border-b px-4 py-2">Email</th>
                    <th className="border-b px-4 py-2">Sequence Step</th>
                    <th className="border-b px-4 py-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {sequenceInfluencers.map((influencer) => {
                    const step = sequenceSteps.find((step) => step.step_number === influencer.sequence_step);
                    const sequenceEmail = allSequenceEmails?.find(
                        (sis) => sis.sequence_influencer_id === influencer.id && sis.sequence_step_id === step?.id,
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
