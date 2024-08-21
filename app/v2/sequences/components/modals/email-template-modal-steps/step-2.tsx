/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from 'react';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { Input } from 'shadcn/components/ui/input';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import { type OutreachStepRequest } from 'pages/api/outreach/email-templates/request';
import { type ModalStepProps } from 'app/v2/sequences/types';
import toast from 'react-hot-toast';

export const EmailTemplateModalStepTwo: FC<ModalStepProps> = ({ onPrevStep, setModalOpen }) => {
    const { t } = useTranslation();
    const { getTemplateVariables } = useOutreachTemplateVariable();
    const {
        emailTemplate,
        setEmailTemplate,
        createTemplate,
        saveExistingAsNew,
        emailTemplateInitialState,
        getTemplate,
        updateTemplate,
        isEdit,
    } = useOutreachTemplate();

    useEffect(() => {
        getTemplateVariables();
    }, []);

    useEffect(() => {
        if (saveExistingAsNew) {
            setEmailTemplate({
                ...emailTemplate,
                name: emailTemplateInitialState.item.name,
                description: emailTemplateInitialState.item.description,
            });
        } else if (emailTemplate.name === '' && emailTemplate.description === '') {
            getTemplate(emailTemplate.id).then((data) =>
                setEmailTemplate({ ...emailTemplate, name: data.name, description: data.description }),
            );
        }
    }, [saveExistingAsNew]);

    const onSave = async () => {
        let action = null;
        if (saveExistingAsNew) {
            action = createTemplate({
                name: emailTemplate?.name,
                description: emailTemplate?.description as string,
                template: emailTemplate?.template,
                subject: emailTemplate?.subject,
                variableIds: emailTemplate?.variables.map((variable) => variable.id),
                step: emailTemplate?.step as OutreachStepRequest,
            });
        } else if (isEdit) {
            action = updateTemplate(emailTemplate.id, {
                name: emailTemplate?.name,
                description: emailTemplate?.description as string,
                template: emailTemplate?.template,
                subject: emailTemplate?.subject,
                variableIds: emailTemplate?.variables.map((variable) => variable.id),
                step: emailTemplate?.step as OutreachStepRequest,
            });
        }
        action
            ?.then(() => {
                setModalOpen(false);
                toast.success('Template saved successfully');
            })
            .catch(() => {
                toast.error('Failed to save template');
            });
    };

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-8"
            data-testid="step1-outreach-form"
            id="step2-template-wizard"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg">
                <div className="relative h-full w-full">
                    <section className="">
                        <p className="text-xl font-semibold text-primary-700">
                            {t('outreaches.emailTemplateModal.templateNameTitle')}
                        </p>
                        <p className="font-normal text-primary-500">
                            {t('outreaches.emailTemplateModal.templateNameDescription')}
                        </p>
                    </section>
                    <div className="mx-auto mt-16 flex min-h-[120px] w-[440px] flex-col gap-2 rounded-md border-2 border-gray-200 bg-white p-4">
                        <Input
                            className="border-2 border-gray-200"
                            placeholder={t('outreaches.emailTemplateModal.templateNamePlaceholder') ?? ''}
                            value={emailTemplate?.name}
                            onChange={(e) => setEmailTemplate({ ...emailTemplate, name: e.target.value })}
                        />
                        <textarea
                            className="rounded-sm border-2 border-gray-200 placeholder:text-gray-400"
                            placeholder={t('outreaches.emailTemplateModal.templateNameDescriptionPlaceholder') ?? ''}
                            value={emailTemplate?.description}
                            onChange={(e) => setEmailTemplate({ ...emailTemplate, description: e.target.value })}
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 flex justify-center space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => {
                                onPrevStep();
                            }}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                            data-testid="cancel-button"
                        >
                            {t('outreaches.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => onSave()}
                            id="step2-finish-button"
                        >
                            <span className="ml-1">{t('outreaches.saveAndContinue')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
