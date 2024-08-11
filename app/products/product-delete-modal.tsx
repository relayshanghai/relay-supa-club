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
            title={t('products.delete.title') as string}
            visible={show}
            onClose={() => setShow(false)}
            closeButtonText={t('products.delete.cancel') as string}
            okButtonText={t('products.delete.okay') as string}
            onOkay={() => {
                setShow(false);
                handleDelete();
            }}
        >
            <p className="mb-6 mt-4">{t('products.delete.description')}</p>
        </ModalWithButtons>
    );
};
