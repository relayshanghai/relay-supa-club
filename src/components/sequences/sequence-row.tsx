import { useTranslation } from 'react-i18next';
import { useInfluencerSocialProfile } from 'src/hooks/use-influencer-social-profile';

import type { SequenceInfluencer, SequenceEmail } from 'src/utils/api/db';

interface SequenceRowProps {
    sequenceInfluencer: SequenceInfluencer;
    sequenceEmail?: SequenceEmail;
}

const SequenceRow: React.FC<SequenceRowProps> = ({ sequenceInfluencer, sequenceEmail }) => {
    const { influencerSocialProfile } = useInfluencerSocialProfile(sequenceInfluencer.influencer_social_profile_id);
    const { i18n } = useTranslation();
    return (
        <tr>
            <td className="border-b px-4 py-2">{influencerSocialProfile?.name}</td>
            <td className="border-b px-4 py-2">{sequenceInfluencer.email}</td>
            <td className="border-b px-4 py-2">{sequenceInfluencer.sequence_step}</td>
            <td className="border-b px-4 py-2">
                {new Date(sequenceInfluencer.created_at).toLocaleDateString(i18n.language, {
                    month: 'short',
                    day: 'numeric',
                })}
            </td>
            <td className="border-b px-4 py-2">{sequenceEmail?.email_delivery_status}</td>
        </tr>
    );
};

export default SequenceRow;
