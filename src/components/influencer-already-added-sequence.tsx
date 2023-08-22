import { useTranslation } from 'react-i18next';
import { ModalWithButtons } from './modal-with-buttons';
import type { Sequence } from 'src/utils/api/db';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ALREADY_ADDED_MODAL } from 'src/utils/rudderstack/event-names';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

export const InfluencerAlreadyAddedSequenceModal = ({
    show,
    setShow,
    setSequenceListModal,
    sequences,
    selectedCreatorUserId,
    allSequenceInfluencers,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    setSequenceListModal: (show: boolean) => void;
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
    const { trackEvent } = useRudderstack();

    return (
        <ModalWithButtons
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
                trackEvent(ALREADY_ADDED_MODAL('click do not add'));
            }}
            closeButtonText={t('campaigns.modal.doNotAdd') || ''}
            okButtonText={t('campaigns.modal.addAnyway') || ''}
            onOkay={() => {
                setShow(false);
                setSequenceListModal(true);
                trackEvent(ALREADY_ADDED_MODAL('click add anyway'));
            }}
        >
            <div className="flex flex-col gap-2">
                <p>{`${t('sequences.influencerAlreadyAdded')} ${(sequencesWithInfluencer ?? []).join(', ')}`}</p>
            </div>
        </ModalWithButtons>
    );
};
