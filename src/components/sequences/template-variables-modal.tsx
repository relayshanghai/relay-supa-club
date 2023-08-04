import { Modal, type ModalProps } from '../modal';

export interface TemplateVariablesModalProps extends Omit<ModalProps, 'children'> {
    templateId?: string;
}

export const TemplateVariablesModal = (props: TemplateVariablesModalProps) => {
    return (
        <Modal {...props}>
            <div>Template Variables Modal</div>
        </Modal>
    );
};
