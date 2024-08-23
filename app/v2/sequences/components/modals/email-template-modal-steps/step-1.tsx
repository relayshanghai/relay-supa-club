/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { OutreachEmailVariableAccordion } from './components/email-template-variables-accordion';
import { EmailTemplateEditor } from './components/email-template-editor';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';
import { type Editor } from '@tiptap/react';
import { useAtomValue } from 'jotai';
import { currentEditorAtom } from 'src/atoms/current-editor';
import { useOutreachTemplate } from 'src/hooks/use-outreach-template';
import { type ModalStepProps } from 'app/v2/sequences/types';

export const addVariable = (editor: Editor | null, text: string) => {
    editor?.commands.insertContent(`<variable-component text="${text}" />`);
};

export const EmailTemplateModalStepOne: FC<ModalStepProps> = ({ setModalOpen, onNextStep }) => {
    const { t } = useTranslation();
    const editor = useAtomValue(currentEditorAtom);
    const { templateVariables, getTemplateVariables } = useOutreachTemplateVariable();
    const { emailTemplate, setEmailTemplate, isEdit, setSaveExistingAsNew } = useOutreachTemplate();
    const categories = templateVariables.reduce((acc, variable) => {
        if (!acc.includes(variable.category)) {
            acc.push(variable.category);
        }
        return acc;
    }, [] as string[]);

    useEffect(() => {
        if (templateVariables.length === 0) {
            getTemplateVariables();
        }
    }, [templateVariables.length]);

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-4"
            data-testid="step1-template-wizard"
            id="step1-template-wizard"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg bg-white shadow">
                <div
                    className="inline-flex flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white"
                    id="variable-list-template-wizard"
                >
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
                                onClick={(item) => {
                                    setEmailTemplate({
                                        ...emailTemplate,
                                        variables: [...emailTemplate.variables, item],
                                    });
                                    addVariable(editor, item.name);
                                }}
                            />
                        ))}
                    </Accordion>
                </div>
                <div className="relative flex h-full w-full flex-col items-center overflow-y-scroll px-9 py-6">
                    <div className="w-full">
                        <EmailTemplateEditor
                            setTemplateDetails={(t) => setEmailTemplate(t)}
                            templateDetails={emailTemplate}
                        />
                    </div>
                    <div className="relative mt-2 flex w-full justify-end space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="absolute left-0 ml-0 inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => setModalOpen(false)}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2 disabled:!bg-gray-100 disabled:text-gray-300"
                            data-testid="next-button"
                            disabled={!isEdit}
                            onClick={() => {
                                onNextStep();
                                setSaveExistingAsNew(false);
                            }}
                        >
                            <span className="ml-1">{t('outreaches.modifyExistingTemplate')}</span>
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            id="email-template-finish-button"
                            onClick={() => {
                                onNextStep();
                                setSaveExistingAsNew(true);
                            }}
                        >
                            <span className="ml-1">{t('outreaches.continueAsNewTemplate')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
