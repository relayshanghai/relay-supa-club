import { ModalWithButtons } from '../modals';
import type { FC } from 'react';

type ConfirmModalProps = {
    show: boolean;
    setShow: (show: boolean) => void;
    positiveHandler: () => void;
    cancelHandler?: () => void;
    title?: string;
    description?: string;
    cancelButtonText?: string;
    okButtonText?: string;
};

export const ConfirmModal: FC<ConfirmModalProps> = ({
    show,
    setShow,
    positiveHandler,
    cancelHandler,
    title,
    description,
    cancelButtonText,
    okButtonText,
}) => {
    return (
        <ModalWithButtons
            title={title ?? 'Are you sure want to delete this item?'}
            visible={show}
            onClose={() => {
                setShow(false);
                cancelHandler && cancelHandler();
            }}
            closeButtonText={cancelButtonText ?? 'Cancel'}
            okButtonText={okButtonText ?? 'Yes, Delete them'}
            onOkay={() => {
                setShow(false);
                positiveHandler();
            }}
        >
            <p className="mb-6 mt-4">{description}</p>
        </ModalWithButtons>
    );
};
