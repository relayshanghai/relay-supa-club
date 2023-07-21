import type { SequenceInfluencer } from 'src/utils/api/email-engine/prototype-mocks';
import SequenceRow from './sequence-row';

interface SequenceTableProps {
    influencers: SequenceInfluencer[];
}

const SequenceTable: React.FC<SequenceTableProps> = ({ influencers }) => {
    return (
        <table className="border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border-b px-4 py-2">ID</th>
                    <th className="border-b px-4 py-2">Name</th>
                    <th className="border-b px-4 py-2">Email</th>
                    <th className="border-b px-4 py-2">Sequence Step</th>
                    <th className="border-b px-4 py-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {influencers.map((influencer) => (
                    <SequenceRow key={influencer.id} influencer={influencer} />
                ))}
            </tbody>
        </table>
    );
};

export default SequenceTable;
