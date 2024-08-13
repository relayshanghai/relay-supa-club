/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import { useTranslation } from 'react-i18next';
import { SequenceVariableAccordion } from './components/sequence-variables-accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcn/components/ui/tabs';
import { Step } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import SequenceEmailVariable from './components/sequence-email-variables';
import { type ModalStepProps } from 'app/v2/sequences/types';
import { Bell, ClockCheckedOutline, SendOutline } from 'app/components/icons';
import { Button } from 'app/components/buttons';
import { useSequenceEmailTemplates, useStagedSequenceEmailTemplateStore } from 'src/hooks/v2/use-sequences-template';
import { useSequence } from 'src/hooks/v2/use-sequences';

export const CampaignModalStepThree: FC<ModalStepProps> = ({ setModalOpen, onPrevStep }) => {
    const { t } = useTranslation();
    const { getSequenceEmailTemplate } = useSequenceEmailTemplates({});
    const { stagedSequenceEmailTemplates, setStagedSequenceEmailTemplate } = useStagedSequenceEmailTemplateStore();
    const { sequenceVariables, setSequenceVariables, createSequences, sequence, setSequence } = useSequence();

    const categories = sequenceVariables.reduce((acc, variable) => {
        if (!acc.includes(variable.category)) {
            acc.push(variable.category);
        }
        return acc;
    }, [] as string[]);

    useEffect(() => {
        stagedSequenceEmailTemplates.forEach((template) => {
            if (sequenceVariables.length !== 0) {
                return;
            }
            getSequenceEmailTemplate(template.id).then((d) => {
                // check if the variable already exists
                const exists = sequenceVariables?.find((v) => v.name === d.name);
                if (!exists) {
                    const variables = d?.variables?.map((v) => ({ ...v, value: '' }));
                    setSequenceVariables([...sequenceVariables, ...(variables ?? [])]);
                }
            });
        });
    }, []);

    const onSave = async () => {
        return createSequences({
            name: sequence?.name as string,
            autoStart: sequence?.autoStart,
            productId: sequence?.product?.id,
            sequenceTemplates: stagedSequenceEmailTemplates.map((template) => ({
                id: template.id,
            })),
            variables: sequenceVariables.map((v) => ({
                name: v.name,
                value: v.value ?? '',
            })),
        }).then(() => {
            setModalOpen(false);
            setStagedSequenceEmailTemplate([]);
            setSequence(null);
            setSequenceVariables([]);
        });
    };

    return (
        <div
            className="flex shrink grow basis-0 flex-col items-start justify-start gap-6 self-stretch rounded-b-lg px-8 py-4"
            data-testid="step1-outreach-form"
        >
            <div className="inline-flex w-[896px] shrink grow basis-0 items-start justify-start overflow-y-auto rounded-lg bg-white shadow">
                <div className="inline-flex flex-col items-start justify-start self-stretch border-r border-gray-200 bg-white">
                    <div className="inline-flex w-[318px] items-start justify-start gap-2.5 self-stretch border-b border-gray-200 px-3 pb-3 pt-4">
                        <div className="font-['Poppins'] text-base font-semibold tracking-tight text-gray-700">
                            {t('outreaches.templateVariables')}
                        </div>
                    </div>
                    <Accordion type="multiple" className="w-full" defaultValue={['outreach']}>
                        {categories?.map((d) => (
                            <SequenceVariableAccordion
                                key={d}
                                title={d}
                                items={sequenceVariables.filter((v) => v.category === d) ?? []}
                            />
                        ))}
                    </Accordion>
                </div>
                <div className="relative flex h-full w-full flex-col items-center px-9 py-6">
                    <div className="w-full">
                        <Tabs defaultValue={Step.OUTREACH} className="">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger className="flex gap-5" value={Step.OUTREACH}>
                                    <SendOutline className="h-4 w-4 -rotate-45 stroke-gray-400" strokeWidth={2} />
                                    {t('outreaches.steps.Outreach')}
                                </TabsTrigger>
                                <TabsTrigger className="flex gap-5" value={Step.FIRST_FOLLOW_UP}>
                                    <ClockCheckedOutline className="h-4 w-4 self-center stroke-gray-400" />
                                    {t('outreaches.steps.firstFollowUp')}
                                </TabsTrigger>
                                <TabsTrigger className="flex gap-5" value={Step.SECOND_FOLLOW_UP}>
                                    <Bell className="h-4 w-4 self-center stroke-gray-400" />
                                    {t('outreaches.steps.secondFollowUp')}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value={Step.OUTREACH}>
                                <SequenceEmailVariable step={Step.OUTREACH} />
                            </TabsContent>
                            <TabsContent value={Step.FIRST_FOLLOW_UP}>
                                <SequenceEmailVariable step={Step.FIRST_FOLLOW_UP} />
                            </TabsContent>
                            <TabsContent value={Step.SECOND_FOLLOW_UP}>
                                <SequenceEmailVariable step={Step.SECOND_FOLLOW_UP} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => {
                                onPrevStep();
                            }}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                            data-testid="cancel-button"
                        >
                            {t('outreaches.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => onSave()}
                        >
                            <span className="ml-1">{t('outreaches.saveAndContinue')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};