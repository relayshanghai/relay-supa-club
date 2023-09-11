import { useState } from 'react';
import { ModalWithButtons } from './modal-with-buttons';
import { Spinner } from './icons';
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
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    return (
        <ModalWithButtons
            title={t('sequences.delete.title') || 'Delete influencer from sequence?'}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
            closeButtonText={t('sequences.delete.cancel') || 'Cancel'}
            okButtonText={
                loading ? (
                    <Spinner className="h-5 w-5 fill-primary-500 text-white" />
                ) : (
                    t('sequences.delete.okay') || 'Yes, Delete them'
                )
            }
            onOkay={async () => {
                setLoading(true);
                await deleteHandler(influencerIds);
                setLoading(false);
                setShow(false);
            }}
        >
            <p className="mb-6 mt-4">{t('sequences.delete.description')}</p>
        </ModalWithButtons>
    );
};
