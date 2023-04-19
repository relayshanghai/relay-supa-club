import { Button } from '../button';
import { Modal } from './modal';
import type { ModalProps } from './modal';

export interface ModalWithButtonProps extends ModalProps {
    closeButtonText?: string;
    okButtonText?: string;
    onOkay?: () => void;
}

export const ModalWithButtons = ({ children, ...props }: ModalWithButtonProps) => {
    const { onClose, closeButtonText, okButtonText, onOkay } = props;
    return (
        <Modal {...props}>
            {children}
            <div className="flex flex-row justify-end gap-x-2 gap-y-4">
                {okButtonText && (
                    <Button type="button" variant="primary" onClick={onOkay}>
                        {okButtonText}
                    </Button>
                )}

                {closeButtonText && (
                    <Button type="button" variant="secondary" onClick={() => onClose()}>
                        {closeButtonText}
                    </Button>
                )}
            </div>
        </Modal>
    );
};
