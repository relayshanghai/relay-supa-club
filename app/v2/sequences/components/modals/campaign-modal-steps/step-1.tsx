/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, useEffect } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import {
    type OutreachEmailTemplateEntity,
    Step,
} from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import { useSequenceEmailTemplates } from 'src/hooks/v2/use-sequences-template';
import { SequenceAccordion } from './components/sequence-accordion';
import { SequenceStepDuration } from './components/sequence-step-duration';
import { SequenceStepItem } from './components/sequence-step-item';
import { useTranslation } from 'react-i18next';
import { type ModalStepProps } from 'app/v2/sequences/types';
import { Bell, ClockCheckedOutline, SendOutline } from 'app/components/icons';
import { Button } from 'app/components/buttons';
import { useSequence } from 'src/hooks/v2/use-sequences';
import { type SequenceStepEntity } from 'src/backend/database/sequence/sequence-step-entity';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { useSequenceEmailTemplateStore } from 'src/store/reducers/sequence-template';
import { sortStepsByKeys } from 'app/v2/sequences/common/outreach-step';

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
    const { stagedSequenceEmailTemplates, setStagedSequenceEmailTemplate, resetStagedSequenceEmailTemplate } =
        useSequenceEmailTemplateStore();
    const { setSequence, sequence, isEdit, getSequence, loading } = useSequence();
    const { t } = useTranslation();

    useEffect(() => {
        refreshOutreachEmailTemplates();
        refreshFirstFollowUpEmailTemplates();
        refreshSecondFollowUpEmailTemplates();
        resetStagedSequenceEmailTemplate();
    }, []);

    useEffect(() => {
        (async () => {
            const sequenceEmailTemplates = Object.values(stagedSequenceEmailTemplates).map((d) => d?.id);
            if (sequence?.id && (isEdit || !sequenceEmailTemplates.every((d) => d))) {
                const seq = await getSequence(sequence?.id);
                let sequenceEmailTemplate = {};
                seq.steps.forEach((step) => {
                    sequenceEmailTemplate = {
                        ...sequenceEmailTemplate,
                        [step.outreachEmailTemplate?.step as Step]: step.outreachEmailTemplate,
                    };
                });
                setStagedSequenceEmailTemplate(sortStepsByKeys(sequenceEmailTemplate as any));
            } else if (!isEdit) {
                resetStagedSequenceEmailTemplate();
            }
        })();
    }, [isEdit]);

    const onDelete = (step: Step) => {
        const s = { ...stagedSequenceEmailTemplates };
        s[step] = null;
        setStagedSequenceEmailTemplate(s);
    };

    const onNextStepHandler = () => {
        const sequenceEmailTemplates = Object.values(stagedSequenceEmailTemplates);
        setSequence({
            ...sequence,
            steps: sequenceEmailTemplates.map((d) => ({
                stepNumber: d?.step,
                outreachEmailTemplate: { id: d?.id },
            })) as unknown as SequenceStepEntity[],
        } as SequenceEntity);
        onNextStep();
    };

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-4"
            data-testid="step1-outreach-form"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-hidden rounded-lg bg-white shadow">
                <div className="inline-flex max-h-[545px] w-[297px] flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white">
                    <div className="inline-flex items-start justify-start gap-2.5 self-stretch border-b border-gray-200 px-3 pb-3 pt-4">
                        <div className="font-['Poppins'] text-base font-semibold tracking-tight text-gray-700">
                            {t('outreaches.templates')}
                        </div>
                    </div>
                    <Accordion type="multiple" className="w-full overflow-y-scroll" defaultValue={['outreach']}>
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
                    {loading && <>Loading...</>}
                    {Object.values(stagedSequenceEmailTemplates).map((d) => {
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
                                    onDelete={() => onDelete(d.step)}
                                />
                                {d.step !== Step.SECOND_FOLLOW_UP && <SequenceStepDuration duration={24} />}
                            </div>
                        );
                    })}
                    {stagedSequenceEmailTemplates[Step.SECOND_FOLLOW_UP] && (
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
                            onClick={() => {
                                onNextStepHandler();
                            }}
                        >
                            <span className="ml-1">{t('outreaches.saveSequenceTemplates')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
