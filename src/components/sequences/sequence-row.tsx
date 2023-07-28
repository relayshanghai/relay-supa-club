import type { SequenceInfluencer } from 'src/utils/api/email-engine/prototype-mocks';

interface SequenceRowProps {
    influencer: SequenceInfluencer;
}

const SequenceRow: React.FC<SequenceRowProps> = ({ influencer }) => {
    return (
        <tr>
            <td className="border-b px-4 py-2">{influencer.name}</td>
            <td className="border-b px-4 py-2">{influencer.email}</td>
            <td className="border-b px-4 py-2">{influencer.sequenceStep}</td>
            <td className="border-b px-4 py-2">{influencer.status}</td>
        </tr>
    );
};

export default SequenceRow;
