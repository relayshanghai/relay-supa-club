/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from 'react';
import { type ModalStepProps } from '../types';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { Input } from 'shadcn/components/ui/input';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import { type OutreachStepRequest } from 'pages/api/outreach/email-templates/request';

export const EmailTemplateModalStepTwo: FC<ModalStepProps> = ({ setModalOpen }) => {
    const { t } = useTranslation();
    const { getTemplateVariables } = useOutreachTemplateVariable();
    const { emailTemplate, setEmailTemplate, createTemplate } = useOutreachTemplate();

    useEffect(() => {
        getTemplateVariables();
    }, []);

    const onSave = async () => {
        createTemplate({
            name: emailTemplate?.name,
            description: emailTemplate?.description as string,
            template: emailTemplate?.template,
            subject: emailTemplate?.subject,
            variableIds: emailTemplate?.variableIds,
            step: emailTemplate?.step as OutreachStepRequest,
        }).then(() => setModalOpen(false));
    };

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-8"
            data-testid="step1-outreach-form"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg">
                <div className="relative h-full w-full">
                    <section className="">
                        <p className="text-xl font-semibold text-primary-700">Name your new template</p>
                        <p className="font-normal text-primary-500">
                            Give it a brief description so you can easily remember what it{"'"}s for.
                            <br />
                            This is what it will look like on other pages.
                        </p>
                    </section>
                    <div className="mx-auto mt-16 flex min-h-[120px] w-[440px] flex-col gap-2 rounded-md border-2 border-gray-200 bg-white p-4">
                        <Input
                            className="border-2 border-gray-200"
                            placeholder="Template Name"
                            value={emailTemplate?.name}
                            onChange={(e) => setEmailTemplate({ ...emailTemplate, name: e.target.value })}
                        />
                        <textarea
                            className="rounded-sm border-2 border-gray-200 placeholder:text-gray-400"
                            placeholder="Template Description"
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
                                setModalOpen(false);
                            }}
                            data-testid="back-button"
                        >
                            {t('outreaches.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => onSave()}
                        >
                            <span className="ml-1">{t('outreaches.saveAndContinue')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
