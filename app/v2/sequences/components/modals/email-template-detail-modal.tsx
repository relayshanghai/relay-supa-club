import {
    type OutreachEmailTemplateEntity,
    type Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useTranslation } from 'react-i18next';
import { Modal } from 'app/components/modals';
import { CheckIcon, Cross } from 'app/components/icons';
import { Button } from 'app/components/buttons';
import { useSequenceEmailTemplateStore } from 'src/store/reducers/sequence-template';
import { getOutreachStepsTranslationKeys } from '../../common/outreach-step';
import { convertTiptapVariableToComponent } from '../utils';

export const EmailTemplateDetailModal = ({
    showEmailTemplateDetailModal,
    setShowEmailTemplateDetailModal,
    data,
}: {
    showEmailTemplateDetailModal: boolean;
    setShowEmailTemplateDetailModal: (showEmailTemplateDetailModal: boolean) => void;
    data: OutreachEmailTemplateEntity & { step: Step };
}) => {
    const { t } = useTranslation();
    const { setStagedSequenceEmailTemplate, stagedSequenceEmailTemplates } = useSequenceEmailTemplateStore();

    const addToSequence = () => {
        const d = { ...stagedSequenceEmailTemplates };
        d[data.step] = data;
        setStagedSequenceEmailTemplate(d);
    };

    return (
        <Modal
            visible={showEmailTemplateDetailModal}
            onClose={() => setShowEmailTemplateDetailModal(false)}
            padding={0}
            maxWidth="!w-[575px]"
        >
            <div className="rounded-lg">
                <div
                    className="relative flex min-h-[250px] w-[575px] flex-col items-start justify-start p-[24px] shadow"
                    data-testid="template-detail-modal-body"
                >
                    <div
                        className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer"
                        onClick={() => setShowEmailTemplateDetailModal(false)}
                        data-testid="template-detail-modal-close-button"
                    >
                        <Cross className="flex h-6 w-6 fill-gray-500 stroke-white" />
                    </div>
                    {/* body start */}
                    <div className="mb-4 flex w-full gap-6">
                        <div className="w-[200px]">
                            <div
                                className="min-w-[100px] rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-semibold  text-gray-500"
                                data-testid="sequence-name-input"
                            >
                                {data?.step && t(`sequences.steps.${getOutreachStepsTranslationKeys(data?.step)}`)}
                            </div>
                        </div>
                        <div className="w-[300px]">
                            <div
                                className="min-w-[300px] overflow-x-scroll rounded-lg border-2 border-gray-200 px-[10px] py-[6px] font-normal text-gray-500"
                                data-testid="subject-line-input"
                                dangerouslySetInnerHTML={{
                                    __html: convertTiptapVariableToComponent(data?.subject ?? ''),
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex w-full">
                        <section
                            className="h-[200px] w-full cursor-default overflow-y-auto rounded-lg border-2 border-gray-200 px-[10px] py-[6px] text-gray-500"
                            data-testid="template-input"
                            dangerouslySetInnerHTML={{
                                __html: convertTiptapVariableToComponent(data?.template ?? ''),
                            }}
                        />
                    </div>
                    <div className="mt-4 flex w-full justify-between ">
                        {/* <Button
                            type="button"
                            variant="secondary"
                            className="!border-red-500 !p-2"
                            data-testid="delete-button"
                        >
                            <TrashIcon className="h-4 w-4 stroke-red-600" />
                        </Button> */}
                        <div className="flex justify-center space-x-2">
                            {/* <Button
                                type="button"
                                variant="secondary"
                                className="inline-flex !border-violet-600 !p-2"
                                data-testid="modify-template-button"
                            >
                                <PencilSquareIcon className="mr-1 h-4 w-4 stroke-violet-600" />{' '}
                                <span>{t('outreaches.modifyTemplate')}</span>
                            </Button> */}
                            <Button
                                type="button"
                                variant="primary"
                                className="inline-flex items-center border-none !bg-pink-500 !p-2"
                                data-testid="use-in-sequence-button"
                                onClick={() => {
                                    addToSequence();
                                    setShowEmailTemplateDetailModal(false);
                                }}
                            >
                                {'{'}
                                <CheckIcon className="h-4 w-4 stroke-white" />
                                {'}'} <span className="ml-1">{t('outreaches.useInSequence')}</span>
                            </Button>
                        </div>
                    </div>
                    {/* body end */}
                </div>
            </div>
        </Modal>
    );
};
