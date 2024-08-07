/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { type ModalStepProps } from '../types';
import { OutreachEmailVariableAccordion } from './components/sequence-variables-accordion';
import { EmailTemplateEditor } from './components/email-template-editor';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';

export const EmailTemplateModalStepThree: FC<ModalStepProps> = ({ setModalOpen, onNextStep }) => {
    const { t } = useTranslation();
    const { getTemplateVariables, templateVariables } = useOutreachTemplateVariable();

    useEffect(() => {
        getTemplateVariables();
    }, []);

    const categories = templateVariables.reduce((acc, variable) => {
        if (!acc.includes(variable.category)) {
            acc.push(variable.category);
        }
        return acc;
    }, [] as string[]);

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-4"
            data-testid="step1-outreach-form"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg bg-white shadow">
                <div className="inline-flex flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white">
                    <div className="inline-flex w-[318px] items-start justify-start gap-2.5 self-stretch border-b border-gray-200 px-3 pb-3 pt-4">
                        <div className="font-['Poppins'] text-base font-semibold tracking-tight text-gray-700">
                            {t('outreaches.templateVariables')}
                        </div>
                    </div>
                    <Accordion type="multiple" className="w-full">
                        {categories.map((category) => (
                            <OutreachEmailVariableAccordion
                                key={category}
                                title={category}
                                items={templateVariables.filter((d) => d.category === category)}
                            />
                        ))}
                    </Accordion>
                </div>
                <div className="relative flex h-full w-full flex-col items-center px-9 py-6">
                    <div className="w-full">
                        <EmailTemplateEditor
                            content=""
                            setTemplateDetails={() => null}
                            status={'OUTREACH'}
                            subject=""
                        />
                    </div>
                    <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => setModalOpen(false)}
                            data-testid="back-button"
                        >
                            {t('outreaches.skipForNow')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => onNextStep()}
                        >
                            <span className="ml-1">{t('outreaches.saveAndFinish')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
