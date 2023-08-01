import type { SequenceInfluencer } from 'src/utils/api/db';
import SequenceRow from './sequence-row';

interface SequenceTableProps {
    sequenceInfluencers: SequenceInfluencer[];
}

const SequenceTable: React.FC<SequenceTableProps> = ({ sequenceInfluencers }) => {
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
                {sequenceInfluencers.map((influencer) => (
                    <SequenceRow key={influencer.id} sequenceInfluencer={influencer} />
                ))}
            </tbody>
        </table>
    );
};

export default SequenceTable;
