import { ModalWithButtons } from './modal-with-buttons';
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
    const { t } = useTranslation();
    return (
        <ModalWithButtons
            title={t('sequences.delete.deleteSequence_name', { name }) || 'Delete sequence?'}
            visible={show}
            onClose={() => setShow(false)}
            closeButtonText={t('sequences.delete.cancel') || 'Cancel'}
            okButtonText={t('sequences.delete.okaySequence') || 'Yes, Delete'}
            onOkay={() => {
                setShow(false);
                handleDelete();
            }}
        >
            <p className="mb-6 mt-4">{t('sequences.delete.deleteSequenceDescription')}</p>
        </ModalWithButtons>
    );
};
