/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import { BoostbotSelected, DotsHorizontal, Expand, Plus, SendOutline } from 'src/components/icons';
import Bell from 'src/components/icons/Bell';
import { EmailTemplateDetailModal } from '../email-template-detail-modal';
import { ArrowLongDownIcon } from '@heroicons/react/24/solid';
import { Button } from 'src/components/button';
import {
    type OutreachEmailTemplateEntity,
    Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequenceEmailTemplates, useStagedSequenceEmailTemplateStore } from 'src/hooks/v2/use-sequences-template';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';

type SequenceAccordionProps = {
    title: string;
    items: OutreachEmailTemplateEntity[];
    step: Step;
};

type SequenceStepItemProps = {
    title: string;
    description: string;
    onDelete: () => void;
};

type SequenceStepDurationProps = {
    duration: number; // in hours
};

const SequenceAccordion: FC<SequenceAccordionProps> = ({ title, items, step }) => {
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
                        <span>Create new template</span>
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

const SequenceStepItem: FC<SequenceStepItemProps> = ({ title, description, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    return (
        <div className="inline-flex h-[88px] w-[440px] items-start justify-start gap-1 rounded-xl border-2 border-gray-200 bg-white py-4 pl-4 pr-3">
            <div className="relative flex h-[52px] shrink grow basis-0 items-start justify-start gap-4">
                <div className="absolute right-1 top-1 ">
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger>
                            <DotsHorizontal className="h-4 w-4 rotate-90 stroke-gray-300" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className="text-sm" align="end">
                                <DropdownMenuItem
                                    onSelect={() => {
                                        onDelete();
                                    }}
                                    className="flex text-sm"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-2.5 rounded-[28px] border-4 border-violet-50 bg-violet-100 p-2 mix-blend-multiply">
                    <BoostbotSelected className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="inline-flex items-start justify-start gap-1.5">
                        <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                            {title}
                        </div>
                    </div>
                    <div className="self-stretch font-['Poppins'] text-xs font-normal leading-tight tracking-tight text-gray-400">
                        {description?.substring(0, 100)} {description?.length > 100 && '...'}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SequenceStepDuration: FC<SequenceStepDurationProps> = ({ duration }) => {
    return (
        <div className="inline-flex h-10 w-fit items-center justify-start gap-4 py-1">
            <ArrowLongDownIcon className="h-8 w-8 fill-gray-300" />
            <div>
                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-300">
                    Wait{' '}
                </span>
                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-violet-400">
                    {Math.ceil(duration / 24)}
                </span>
                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-300">
                    {' '}
                    business days
                </span>
            </div>
        </div>
    );
};

const CampaignModalStepOne = () => {
    const {
        sequenceEmailTemplates: outreachEmailTemplates,
        refreshSequenceEmailTemplates: refreshOutreachEmailTemplates,
    } = useSequenceEmailTemplates({
        step: Step.OUTREACH,
    });
    const {
        sequenceEmailTemplates: firstFollowUpEmailTemplates,
        refreshSequenceEmailTemplates: refreshFirstFollowUpEmailTemplates,
    } = useSequenceEmailTemplates({
        step: Step.FIRST_FOLLOW_UP,
    });
    const {
        sequenceEmailTemplates: secondFollowUpEmailTemplates,
        refreshSequenceEmailTemplates: refreshSecondFollowUpEmailTemplates,
    } = useSequenceEmailTemplates({
        step: Step.SECOND_FOLLOW_UP,
    });
    const { stagedSequenceEmailTemplates, setStagedSequenceEmailTemplate } = useStagedSequenceEmailTemplateStore();

    useEffect(() => {
        refreshOutreachEmailTemplates();
        refreshFirstFollowUpEmailTemplates();
        refreshSecondFollowUpEmailTemplates();
    }, []);

    const onDelete = (id: string) => {
        const index = stagedSequenceEmailTemplates.findIndex((d) => d.id === id);
        const s = stagedSequenceEmailTemplates;
        s[index] = null as any;
        setStagedSequenceEmailTemplate(s);
    };

    return (
        <>
            <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg bg-violet-50 px-8 py-4">
                <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start rounded-lg bg-white shadow">
                    <div className="inline-flex w-[297px] flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white">
                        <div className="inline-flex items-start justify-start gap-2.5 self-stretch border-b border-gray-200 px-3 pb-3 pt-4">
                            <div className="font-['Poppins'] text-base font-semibold tracking-tight text-gray-700">
                                Templates
                            </div>
                        </div>
                        <Accordion type="multiple" className="w-full" defaultValue={['outreach']}>
                            <SequenceAccordion
                                title="Outreach"
                                items={outreachEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                                step={Step.OUTREACH}
                            />
                            <SequenceAccordion
                                title="1st Follow-up"
                                items={firstFollowUpEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                                step={Step.FIRST_FOLLOW_UP}
                            />
                            <SequenceAccordion
                                title="2nd Follow-up"
                                items={secondFollowUpEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                                step={Step.SECOND_FOLLOW_UP}
                            />
                        </Accordion>
                    </div>
                    <div className="relative flex h-full w-full flex-col items-center px-9 py-6">
                        {stagedSequenceEmailTemplates.map((d, i) => {
                            if (!d) {
                                return <></>;
                            }
                            return (
                                <div className="flex w-fit flex-col items-center" key={d.id}>
                                    <SequenceStepItem
                                        title={d.name}
                                        description={d.description as string}
                                        onDelete={() => onDelete(d.id)}
                                    />
                                    {i !== stagedSequenceEmailTemplates.length - 1 && (
                                        <SequenceStepDuration duration={24} />
                                    )}
                                </div>
                            );
                        })}
                        {stagedSequenceEmailTemplates.length === 3 && (
                            <>
                                <SequenceStepDuration duration={24} />{' '}
                                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-600">
                                    Influencer will be marked as ‘Ignored’ and removed from campaign
                                </span>
                            </>
                        )}

                        <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                            <Button type="button" variant="neutral" className="inline-flex !p-2 text-sm !text-gray-400">
                                Back
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            >
                                <span className="ml-1">Save sequence templates</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignModalStepOne;
