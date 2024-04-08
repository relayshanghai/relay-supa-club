/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import { BoostbotSelected, Expand, Plus } from 'src/components/icons';
import {
    type OutreachEmailTemplateEntity,
    type Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequenceEmailTemplates, useStagedSequenceEmailTemplateStore } from 'src/hooks/v2/use-sequences-template';
import { EmailTemplateDetailModal } from '../../email-template-detail-modal';
import { useTranslation } from 'react-i18next';

type SequenceAccordionProps = {
    title: string;
    items: OutreachEmailTemplateEntity[];
    step: Step;
    icon: JSX.Element;
};

export const SequenceAccordion: FC<SequenceAccordionProps> = ({ title, items, step, icon }) => {
    const { t } = useTranslation();
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const { sequenceEmailTemplate, setSequenceEmailTemplate, getSequenceEmailTemplate } = useSequenceEmailTemplates({
        step,
    });
    const { setStagedSequenceEmailTemplate, stagedSequenceEmailTemplates } = useStagedSequenceEmailTemplateStore();
    const onDetailModalCliked = (d: OutreachEmailTemplateEntity) => {
        getSequenceEmailTemplate(d.id).then((data) => {
            setSequenceEmailTemplate(data);
        });
    };
    return (
        <>
            <AccordionItem value={title.replace(/[\s-]/g, '').toLowerCase()}>
                <AccordionTrigger className="ml-6 shrink grow basis-0 font-['Poppins'] text-base font-semibold tracking-tight text-violet-600 hover:no-underline">
                    <div className="inline-flex space-x-2">
                        {icon}
                        <span>{title}</span>
                    </div>
                </AccordionTrigger>
                {items.map((d, i) => (
                    <AccordionContent
                        key={d.id}
                        className={`relative ml-5 w-[250px] py-3 pl-5 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700 ${
                            (i + 1) % 2 === 0 ? 'even:bg-slate-50' : 'odd:bg-gray-50'
                        }`}
                    >
                        <div
                            className="inline-flex w-full space-x-2 hover:cursor-pointer"
                            onClick={() => {
                                stagedSequenceEmailTemplates.forEach((old, i) => {
                                    if (!old) {
                                        stagedSequenceEmailTemplates[i] = { ...d, step: step };
                                    }
                                });
                                const foundSequenceStep = stagedSequenceEmailTemplates.find((s) => s.step === step);
                                if (foundSequenceStep) {
                                    const s = stagedSequenceEmailTemplates;
                                    const index = s.findIndex((e) => e.step === step);
                                    s[index] = { ...d, step: step };
                                    setStagedSequenceEmailTemplate(s);
                                    return;
                                }
                                setStagedSequenceEmailTemplate([...stagedSequenceEmailTemplates, { ...d, step: step }]);
                            }}
                        >
                            <BoostbotSelected className="h-4 w-4" strokeWidth={2} />
                            <span>{d.name}</span>
                        </div>
                        <Expand
                            className="absolute right-2 top-2 h-2 w-2 stroke-slate-400 hover:cursor-pointer"
                            strokeWidth={2}
                            onClick={() => {
                                onDetailModalCliked(d);
                                setShowDetailModal(true);
                            }}
                        />
                    </AccordionContent>
                ))}
                <AccordionContent className="hover:curson-pointer ml-5 w-[250px] py-3 pl-5 pr-3 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700">
                    <div className="inline-flex space-x-2 text-gray-400">
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        <span>{t('outreaches.createNewTemplate')}</span>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <EmailTemplateDetailModal
                showEmailTemplateDetailModal={showDetailModal && !!sequenceEmailTemplate}
                setShowEmailTemplateDetailModal={(visibility) => {
                    if (!visibility) setSequenceEmailTemplate(null);
                    setShowDetailModal(visibility);
                }}
                data={sequenceEmailTemplate as OutreachEmailTemplateEntity}
            />
        </>
    );
};
