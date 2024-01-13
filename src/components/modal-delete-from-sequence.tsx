import { ModalWithButtons } from './modal-with-buttons';
import { useTranslation } from 'react-i18next';

export const DeleteFromSequenceModal = ({
    show,
    setShow,
    deleteHandler,
    influencerIds,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    deleteHandler: (ids: string[]) => void;
    influencerIds: string[];
}) => {
    const { t } = useTranslation();
    return (
        <ModalWithButtons
            title={t('sequences.delete.title') || 'Delete influencer from sequence?'}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
            closeButtonText={t('sequences.delete.cancel') || 'Cancel'}
            okButtonText={t('sequences.delete.okay') || 'Yes, Delete them'}
            onOkay={async () => {
                setShow(false);
                await deleteHandler(influencerIds);
            }}
        >
            <p className="mb-6 mt-4">{t('sequences.delete.description')}</p>
        </ModalWithButtons>
    );
};
