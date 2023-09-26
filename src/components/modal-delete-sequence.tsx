import { useState } from 'react';
import { ModalWithButtons } from './modal-with-buttons';
import { Spinner } from './icons';
import { useTranslation } from 'react-i18next';
export const DeleteSequenceModal = ({
    show,
    setShow,
    handleDelete,
    name,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    handleDelete: () => void;
    name?: string;
}) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    return (
        <ModalWithButtons
            title={t('sequences.delete.deleteSequence_name', { name }) || 'Delete sequence?'}
            visible={show}
            onClose={() => setShow(false)}
            closeButtonText={t('sequences.delete.cancel') || 'Cancel'}
            okButtonText={
                loading ? (
                    <Spinner className="h-5 w-5 fill-primary-500 text-white" />
                ) : (
                    t('sequences.delete.okaySequence') || 'Yes, Delete'
                )
            }
            onOkay={async () => {
                setLoading(true);
                await handleDelete();
                setLoading(false);
                setShow(false);
            }}
        >
            <p className="mb-6 mt-4">{t('sequences.delete.deleteSequenceDescription')}</p>
        </ModalWithButtons>
    );
};
