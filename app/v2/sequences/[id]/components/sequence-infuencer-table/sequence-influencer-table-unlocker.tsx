import { Button } from 'app/components/buttons';
import { useTranslation } from 'react-i18next';
import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import { useUnlockInfluencer } from 'src/hooks/v2/use-sequence-influencer';

export interface SequneceInfluencerTableUnlockerProps {
    sequenceInfluencer: SequenceInfluencerEntity;
    sequenceId: string;
    index: number;
}
export default function SequenceInfluencerTableUnlocker({ sequenceInfluencer }: SequneceInfluencerTableUnlockerProps) {
    const { t } = useTranslation();
    const { unlocking, unlockInfluencer, loading } = useUnlockInfluencer(sequenceInfluencer.id);

    const caption = !unlocking
        ? t('sequences.unlock')
        : unlocking === 'id'
        ? t('sequences.unlocking')
        : t('sequences.unlockDisabled');
    const handleUnlock = async () => {
        if (unlocking) return;
        await unlockInfluencer();
    };
    return (
        <div>
            <Button disabled={!!unlocking} onClick={handleUnlock} loading={loading}>
                {caption}
            </Button>
        </div>
    );
}
