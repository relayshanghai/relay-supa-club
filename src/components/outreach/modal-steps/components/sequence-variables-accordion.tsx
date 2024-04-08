/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import { BoostbotSelected, Plus, SendOutline } from 'src/components/icons';
import Bell from 'src/components/icons/Bell';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useTranslation } from 'react-i18next';

type SequenceVariableAccordionProps = {
    title: string;
    items: OutreachEmailTemplateEntity[];
};

export const SequenceVariableAccordion: FC<SequenceVariableAccordionProps> = ({ title, items }) => {
    const { t } = useTranslation();
    return (
        <>
            <AccordionItem value={title.replace(/[\s-]/g, '').toLowerCase()}>
                <AccordionTrigger className="ml-6 shrink grow basis-0 font-['Poppins'] text-base font-semibold tracking-tight text-violet-600 hover:no-underline">
                    <div className="inline-flex space-x-2">
                        {title === 'Outreach' ? (
                            <SendOutline className="h-4 w-4 -rotate-45" strokeWidth={2} />
                        ) : (
                            <Bell className="h-4 w-4 self-center" />
                        )}
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
                                //
                            }}
                        >
                            <BoostbotSelected className="h-4 w-4" strokeWidth={2} />
                            <span>{d.name}</span>
                        </div>
                    </AccordionContent>
                ))}
                <AccordionContent className="hover:curson-pointer ml-5 w-[250px] py-3 pl-5 pr-3 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700">
                    <div className="inline-flex space-x-2 text-gray-400">
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        <span>{t('outreaches.createNewTemplate')}</span>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </>
    );
};
