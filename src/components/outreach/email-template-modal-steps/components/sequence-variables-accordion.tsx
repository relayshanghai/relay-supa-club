/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import Bell from 'src/components/icons/Bell';
import { useTranslation } from 'react-i18next';
import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';
import { variableCategories } from '../../utils';
import { Plus } from 'src/components/icons';
import { CreateVariableModal } from '../../email-template-variable-modal';

type OutreachEmailVariableAccordionProps = {
    title: string;
    items: OutreachEmailTemplateVariableEntity[];
};

export const OutreachEmailVariableAccordion: FC<OutreachEmailVariableAccordionProps> = ({ title, items }) => {
    const { t } = useTranslation();
    const [showVariableModal, setShowVariableModal] = useState(false);
    const Icon = () =>
        variableCategories.find((category) => category.name === title)?.icon || (
            <Bell className="h-4 w-4 self-center" />
        );

    return (
        <>
            <CreateVariableModal modalOpen={showVariableModal} setModalOpen={setShowVariableModal} />
            <AccordionItem value={title.replace(/[\s-]/g, '').toLowerCase()}>
                <AccordionTrigger className="ml-6 shrink grow basis-0 font-['Poppins'] text-base font-semibold tracking-tight text-violet-600 hover:no-underline">
                    <div className="inline-flex space-x-2">
                        <Icon />
                        <span>{title}</span>
                    </div>
                </AccordionTrigger>
                {items.map((d) => (
                    <AccordionContent
                        key={d.id}
                        className={`relative w-full !pb-2 pl-5 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700`}
                    >
                        <div className="inline-flex h-fit w-[280px] flex-col items-start justify-start gap-0">
                            <div className="flex h-8 flex-col items-start justify-start gap-1 self-stretch">
                                <div className="inline-flex items-start justify-start gap-1 self-stretch">
                                    <div className="ml-2">
                                        <span className="font-['Poppins'] text-sm font-semibold leading-tight tracking-tight text-gray-700">
                                            {'{'}{' '}
                                        </span>
                                        <span className="font-['Poppins'] text-sm font-semibold leading-tight tracking-tight text-violet-600">
                                            {d.name}
                                        </span>
                                        <span className="font-['Poppins'] text-sm font-semibold leading-tight tracking-tight text-gray-700">
                                            {' '}
                                            {'}'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                ))}
                <AccordionContent className="relative w-full !pb-2 pl-5 font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-700">
                    <div
                        className="inline-flex space-x-2 text-gray-400 hover:cursor-pointer"
                        onClick={() => setShowVariableModal(true)}
                    >
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        <span>{t('outreaches.addTemplateVariables')}</span>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </>
    );
};
