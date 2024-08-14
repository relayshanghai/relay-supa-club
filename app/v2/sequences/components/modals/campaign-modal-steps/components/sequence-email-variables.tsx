/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, useEffect, useState } from 'react';
import { type Step } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequence } from 'src/hooks/v2/use-sequences';
import { useSequenceEmailTemplates } from 'src/hooks/v2/use-sequences-template';
import { type TemplateWithVariableValueType } from 'src/store/reducers/sequence';
import { convertTiptapVariableToComponent, substituteVariable } from '../../../utils';
import { useSequenceEmailTemplateStore } from 'src/store/reducers/sequence-template';

type SequenceStepItemProps = {
    step: Step;
};

const SequenceEmailVariable: FC<SequenceStepItemProps> = ({ step }) => {
    const { getSequenceEmailTemplate } = useSequenceEmailTemplates({});
    const { stagedSequenceEmailTemplates } = useSequenceEmailTemplateStore();
    const { setSelectedTemplate, selectedTemplate, sequenceVariables } = useSequence();
    const [configurableTemplate, setConfigurableTemplate] = useState({
        subject: '',
        template: '',
    });
    const template: any = stagedSequenceEmailTemplates[step];

    useEffect(() => {
        if (!template) {
            return;
        }
        getSequenceEmailTemplate(template?.id)
            .then((template) => {
                setSelectedTemplate({
                    ...template,
                } as TemplateWithVariableValueType);
            })
            .catch(() => {
                //
            });
    }, []);

    useEffect(() => {
        if (!selectedTemplate) {
            return;
        }
        setConfigurableTemplate({
            subject: substituteVariable(
                convertTiptapVariableToComponent(selectedTemplate?.subject ?? ''),
                sequenceVariables ?? [],
            ),
            template: substituteVariable(
                convertTiptapVariableToComponent(selectedTemplate?.template ?? ''),
                sequenceVariables ?? [],
            ),
        });
    }, [selectedTemplate?.subject, selectedTemplate?.template, sequenceVariables]);

    return (
        <>
            <div
                className="mb-4 w-full rounded-lg border-2 border-gray-200 px-4 py-2 font-normal text-gray-500"
                dangerouslySetInnerHTML={{
                    __html: configurableTemplate.subject,
                }}
            />
            <div
                className="h-[350px] w-full items-start justify-center gap-6 overflow-y-scroll rounded-lg border-2 border-gray-200 bg-white px-4"
                dangerouslySetInnerHTML={{
                    __html: configurableTemplate.template,
                }}
            />
        </>
    );
};

export default SequenceEmailVariable;
