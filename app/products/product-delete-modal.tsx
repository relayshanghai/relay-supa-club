import { ModalWithButtons } from 'app/components/modals';
import { useTranslation } from 'react-i18next';
export const ProductDeleteModal = ({
    show,
    setShow,
    handleDelete,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    handleDelete: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <ModalWithButtons
            title={t('products.delete.title') + ''}
            visible={show}
            onClose={() => setShow(false)}
            closeButtonText={t('products.delete.cancel') + ''}
            okButtonText={t('products.delete.okay') + ''}
            onOkay={() => {
                setShow(false);
                handleDelete();
            }}
        >
            <p className="mb-6 mt-4">{t('products.delete.description')}</p>
        </ModalWithButtons>
    );
};
