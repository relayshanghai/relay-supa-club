/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import { Button } from 'src/components/button';
import {
    type OutreachEmailTemplateEntity,
    Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequenceEmailTemplates, useStagedSequenceEmailTemplateStore } from 'src/hooks/v2/use-sequences-template';
import { SequenceAccordion } from './components/sequence-accordion';
import { SequenceStepDuration } from './components/sequence-step-duration';
import { SequenceStepItem } from './components/sequence-step-item';

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
