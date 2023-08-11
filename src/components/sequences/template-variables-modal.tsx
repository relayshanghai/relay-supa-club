import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Modal, type ModalProps } from '../modal';

export interface TemplateVariablesModalProps extends Omit<ModalProps, 'children'> {
    sequenceId?: string;
}

export const TemplateVariablesModal = ({ sequenceId, ...props }: TemplateVariablesModalProps) => {
    const { templateVariables } = useTemplateVariables(sequenceId);
    return (
        <Modal {...props}>
            <div>Template Variables Modal</div>
            <>
                {templateVariables?.map((variable) => (
                    <div key={variable.id}>{variable.name}</div>
                ))}
            </>
        </Modal>
    );
};
