import { Button } from '../button';
import { Modal } from './modal';

export interface ModalProps {
    visible: boolean;
    title?: string | JSX.Element;
    onClose: () => void;
    children: JSX.Element | JSX.Element[];
    closeButtonText?: string;
    okButtonText?: string;
    onOkay?: () => void;
}

export const ModalWithButtons = (props: ModalProps) => {
    const { onClose, children, closeButtonText, okButtonText, onOkay } = props;
    return (
        <Modal {...props}>
            {children}
            <div className="flex flex-row justify-end gap-2">
                {okButtonText && (
                    <div className="mt-4">
                        <Button type="button" variant="primary" onClick={onOkay}>
                            {okButtonText}
                        </Button>
                    </div>
                )}

                {closeButtonText && (
                    <div className="mt-4">
                        <Button type="button" variant="secondary" onClick={() => onClose()}>
                            {closeButtonText}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
