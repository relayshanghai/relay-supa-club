import { useInfluencer } from 'src/hooks/use-influencer';
import { useSequenceSteps } from 'src/hooks/use-sequence_steps';
import type { SequenceInfluencer } from 'src/utils/api/db';

interface SequenceRowProps {
    sequenceInfluencer: SequenceInfluencer;
}

const SequenceRow: React.FC<SequenceRowProps> = ({ sequenceInfluencer }) => {
    const { influencer } = useInfluencer(sequenceInfluencer.influencer_id);
    const { sequenceSteps } = useSequenceSteps(sequenceInfluencer.sequence_id);
    const currentStep = sequenceSteps?.find((step) => step.step_number === sequenceInfluencer.sequence_step);
    return (
        <tr>
            <td className="border-b px-4 py-2">{influencer?.name}</td>
            <td className="border-b px-4 py-2">{sequenceInfluencer.email}</td>
            <td className="border-b px-4 py-2">{sequenceInfluencer.sequence_step}</td>
            <td className="border-b px-4 py-2">{currentStep?.email_delivery_status}</td>
        </tr>
    );
};

export default SequenceRow;
