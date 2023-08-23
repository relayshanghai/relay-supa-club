import { useTranslation } from 'react-i18next';
import type { Sequence } from 'src/utils/api/db';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { Modal } from './modal';
import { Button } from './button';

export const InfluencerAlreadyAddedSequenceModal = ({
    show,
    setShow,
    sequences,
    selectedCreatorUserId,
    allSequenceInfluencers,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    sequences?: Sequence[];
    allSequenceInfluencers?: SequenceInfluencerManagerPage[];
    selectedCreatorUserId?: string;
}) => {
    const { t } = useTranslation();

    const filterForSelectedSequence = (sequence: Sequence) => {
        const sequenceInfluencers = (allSequenceInfluencers ?? []).filter(
            (sequenceInfluencer) => sequenceInfluencer.sequence_id === sequence.id,
        );
        return sequenceInfluencers.some((sequenceInfluencer) => sequenceInfluencer.iqdata_id === selectedCreatorUserId);
    };
    const sequencesWithInfluencer = sequences?.filter(filterForSelectedSequence).map((sequence) => sequence.name);

    return (
        <Modal
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p>{`${t('sequences.influencerAlreadyAdded')} ${(sequencesWithInfluencer ?? []).join(', ')}`}</p>
                </div>
                <Button onClick={() => setShow(false)}>{t('creators.close')}</Button>
            </section>
        </Modal>
    );
};
