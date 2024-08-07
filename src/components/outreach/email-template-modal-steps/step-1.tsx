/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import { type ModalStepProps } from '../campaign-wizard-modal';
import { SendOutline, ClockCheckedOutline, Bell } from 'src/components/icons';

export const CampaignModalStepOne: FC<ModalStepProps> = ({ setModalOpen, onNextStep }) => {
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
    const { t } = useTranslation();

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
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-4"
            data-testid="step1-outreach-form"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg bg-white shadow">
                <div className="inline-flex w-[297px] flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white">
                    <div className="inline-flex items-start justify-start gap-2.5 self-stretch border-b border-gray-200 px-3 pb-3 pt-4">
                        <div className="font-['Poppins'] text-base font-semibold tracking-tight text-gray-700">
                            {t('outreaches.templates')}
                        </div>
                    </div>
                    <Accordion type="multiple" className="w-full" defaultValue={['outreach']}>
                        <SequenceAccordion
                            title={t('outreaches.steps.Outreach')}
                            items={outreachEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                            step={Step.OUTREACH}
                            icon={<SendOutline className="h-4 w-4 -rotate-45 stroke-gray-400" strokeWidth={2} />}
                        />
                        <SequenceAccordion
                            title={t('outreaches.steps.firstFollowUp')}
                            items={firstFollowUpEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                            step={Step.FIRST_FOLLOW_UP}
                            icon={<ClockCheckedOutline className="h-4 w-4 self-center stroke-black" />}
                        />
                        <SequenceAccordion
                            title={t('outreaches.steps.secondFollowUp')}
                            items={secondFollowUpEmailTemplates ?? ([] as OutreachEmailTemplateEntity[])}
                            step={Step.SECOND_FOLLOW_UP}
                            icon={<Bell className="h-4 w-4 self-center" />}
                        />
                    </Accordion>
                </div>
                <div className="relative flex h-full w-full flex-col items-center px-9 py-6">
                    {stagedSequenceEmailTemplates.map((d, i) => {
                        if (!d) {
                            return <></>;
                        }
                        return (
                            <div
                                className="flex w-fit flex-col items-center"
                                key={d.id}
                                data-testid={`test-id-${d.id}`}
                            >
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
                                {t('outreaches.influencerIgnored')}
                            </span>
                        </>
                    )}

                    <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => setModalOpen(false)}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => onNextStep()}
                        >
                            <span className="ml-1">{t('outreaches.saveSequenceTemplates')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
