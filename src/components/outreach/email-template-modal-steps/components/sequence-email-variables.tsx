/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC, useEffect } from 'react';
import {
    type OutreachEmailTemplateEntity,
    type Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequenceEmailTemplates, useStagedSequenceEmailTemplateStore } from 'src/hooks/v2/use-sequences-template';
import { type Nullable } from 'types/nullable';

type SequenceStepItemProps = {
    step: Step;
};

const SequenceEmailVariable: FC<SequenceStepItemProps> = ({ step }) => {
    const { getSequenceEmailTemplate } = useSequenceEmailTemplates({});
    const { stagedSequenceEmailTemplates } = useStagedSequenceEmailTemplateStore();
    const template = stagedSequenceEmailTemplates.find((template) => template.step === step);
    const [emailtemplate, setEmailtemplate] = useState<Nullable<OutreachEmailTemplateEntity>>(null);

    useEffect(() => {
        if (!template) {
            return;
        }
        getSequenceEmailTemplate(template?.id)
            .then((template) => {
                setEmailtemplate(template);
            })
            .catch(() => {
                //
            });
    }, []);

    return (
        <div className="inline-flex h-[374px] w-[506px] items-start justify-center gap-6 overflow-y-scroll rounded-lg border border-gray-200 bg-white  p-3">
            <div className="shrink grow basis-0" dangerouslySetInnerHTML={{ __html: emailtemplate?.template ?? '' }} />
        </div>
    );
};

export default SequenceEmailVariable;
