import type { SequenceStep, TemplateVariable } from 'src/utils/api/db';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import { useEmailTemplates } from 'src/hooks/use-email-templates';
import { fillInTemplateVariables, replaceNewlinesAndTabs } from './helpers';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../icons';

export interface EmailPreviewModalProps extends Omit<ModalProps, 'children'> {
    sequenceSteps: SequenceStep[];
    templateVariables: TemplateVariable[];
}

export const EmailPreviewModal = ({ templateVariables, sequenceSteps, ...modalProps }: EmailPreviewModalProps) => {
    const { t } = useTranslation();
    const { emailTemplates } = useEmailTemplates(sequenceSteps.map((step) => step.template_id));
    return (
        <Modal {...modalProps} maxWidth="max-w-3xl">
            <div>
                <h2 className="text-lg font-semibold text-gray-700">{t('sequences.emailPreview')}</h2>

                {emailTemplates && emailTemplates.length > 0 ? (
                    emailTemplates.map((template) => {
                        return (
                            <div key={template.id} className="pt-6">
                                <h3 className="mb-3 font-semibold text-gray-700">{template.name}</h3>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: replaceNewlinesAndTabs(
                                            fillInTemplateVariables(template.content?.text ?? '', templateVariables),
                                        ),
                                    }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <Spinner
                        className="h-5 w-5 fill-primary-600 text-white"
                        data-testid="email-preview-modal-spinner"
                    />
                )}
            </div>
        </Modal>
    );
};
