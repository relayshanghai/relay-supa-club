/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';

import { SequenceStats } from './sequence-stats';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';
import { Brackets, DeleteOutline, Info, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import type { CommonStatusType, MultipleDropdownObject, TabsProps } from '../library';
import { Badge, SelectMultipleDropdown, Switch, Tabs } from '../library';
import { Button } from '../button';
import { useCallback, useEffect, useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';
import { useTranslation } from 'react-i18next';
import type { SequenceInfluencer } from 'src/utils/api/db';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Tooltip } from '../library';
import { EMAIL_STEPS } from './constants';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useUser } from 'src/hooks/use-user';
import { DeleteFromSequenceModal } from '../modal-delete-from-sequence';

export const SequencePage = ({ sequenceId }: { sequenceId: string }) => {
    const { t } = useTranslation();
    const { profile } = useUser();
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequenceId);
    const { sequenceInfluencers, deleteSequenceInfluencer, refreshSequenceInfluencers } = useSequenceInfluencers(
        sequence && [sequenceId],
    );

    const { sequenceEmails } = useSequenceEmails(sequenceId);
    const { templateVariables } = useTemplateVariables(sequenceId);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => ` **${variable.name}** `) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const [filterSteps, setFilterSteps] = useState<CommonStatusType[]>([]);
    const [influencers, setInfluencers] = useState<SequenceInfluencerManagerPage[] | undefined>(sequenceInfluencers);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        setInfluencers(sequenceInfluencers);
    }, [sequenceInfluencers]);

    const handleStep = useCallback(
        (filters: CommonStatusType[]) => {
            setFilterSteps(filters);
            if (!sequenceInfluencers) {
                return;
            }

            if (filters.length === 0) {
                setInfluencers(sequenceInfluencers);
                return;
            }

            const filteredInfluencers = sequenceInfluencers.filter((x) => {
                const step = sequenceSteps?.find((step) => step.step_number === x.sequence_step - 1);
                return step && step.name && filters.includes(step.name as CommonStatusType);
            });

            setInfluencers(filteredInfluencers);
        },
        [sequenceInfluencers, sequenceSteps],
    );

    const handleStartSequence = async (sequenceInfluencers: SequenceInfluencer[]) => {
        return await sendSequence(sequenceInfluencers);
    };

    const handleAutostartToggle = async (checked: boolean) => {
        if (!sequence) {
            return;
        }
        await updateSequence({ id: sequenceId, auto_start: checked });
    };

    const [showUpdateTemplateVariables, setShowUpdateTemplateVariables] = useState(false);
    const handleOpenUpdateTemplateVariables = () => {
        setShowUpdateTemplateVariables(true);
    };

    const needsAttentionInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === 'To Contact')
        : [];
    const inSequenceInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === 'In Sequence')
        : [];
    const ignoredInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === 'Ignored')
        : [];

    const tabs: TabsProps<SequenceInfluencer['funnel_status']>['tabs'] = [
        {
            label: 'sequences.needsAttention',
            value: 'To Contact',
            afterElement:
                needsAttentionInfluencers?.length && needsAttentionInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{needsAttentionInfluencers.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.inSequence',
            value: 'In Sequence',
            afterElement:
                inSequenceInfluencers?.length && inSequenceInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{inSequenceInfluencers.length}</Badge>
                ) : null,
        },
        {
            label: 'sequences.ignored',
            value: 'Ignored',
            afterElement:
                ignoredInfluencers?.length && ignoredInfluencers.length > 0 ? (
                    <Badge roundSize={5}>{ignoredInfluencers.length}</Badge>
                ) : null,
        },
    ];
    const [currentTab, setCurrentTab] = useState(tabs[0].value);

    const [selection, setSelection] = useState<string[]>([]);

    const currentTabInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === currentTab)
        : [];

    const [emailSteps, setEmailSteps] = useState<MultipleDropdownObject>(EMAIL_STEPS);

    const handleDelete = useCallback(() => {
        selection.map((influencerId) => deleteSequenceInfluencer(influencerId));
        refreshSequenceInfluencers(sequenceInfluencers?.filter((influencer) => !selection.includes(influencer.id)));
    }, [selection, deleteSequenceInfluencer, refreshSequenceInfluencers, sequenceInfluencers]);

    const setEmailStepValues = useCallback(
        (influencers: SequenceInfluencerManagerPage[], options: MultipleDropdownObject) => {
            const emailOptionsWithValue = options;
            Object.keys(EMAIL_STEPS).forEach((option) => {
                emailOptionsWithValue[option as CommonStatusType] = {
                    ...(options[option as CommonStatusType] || {}),
                    value: influencers
                        ? influencers.filter((x) => {
                              const step = sequenceSteps?.find((step) => step.step_number === x.sequence_step);
                              return step?.name === option;
                          }).length
                        : 0,
                };
            });

            return emailOptionsWithValue;
        },
        [sequenceSteps],
    );

    useEffect(() => {
        if (!sequenceInfluencers || sequenceInfluencers.length <= 0 || !sequenceSteps) {
            return;
        }
        setEmailSteps(setEmailStepValues(sequenceInfluencers, EMAIL_STEPS));
    }, [sequenceInfluencers, setEmailSteps, sequenceSteps, setEmailStepValues]);

    const isMissingSequenceSendEmail = !profile?.sequence_send_email || !profile?.email_engine_account_id;

    const autoStartTooltipTitle = isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltip')
        : t('sequences.autoStartTooltip');
    const autoStartTooltipDescription = isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltipDescription')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables_variables', {
              variables: missingVariables,
          })
        : t('sequences.autoStartTooltipDescription');

    return (
        <Layout>
            <TemplateVariablesModal
                sequenceId={sequenceId}
                visible={showUpdateTemplateVariables}
                onClose={() => setShowUpdateTemplateVariables(false)}
                sequenceSteps={sequenceSteps ?? []}
                templateVariables={templateVariables ?? []}
            />
            <div className="flex flex-col space-y-4 p-6">
                <div className="flex w-fit gap-6">
                    <h1 className="mr-4 self-center text-3xl font-semibold text-gray-800">{sequence?.name}</h1>
                    <Button
                        onClick={handleOpenUpdateTemplateVariables}
                        variant="secondary"
                        className="relative ml-auto flex border-primary-600 bg-white text-primary-600"
                    >
                        <Brackets className="mr-2 h-6" />
                        <p className="self-center">{t('sequences.updateTemplateVariables')}</p>
                        {missingVariables.length > 0 && (
                            <div
                                data-testid="missing-variables-alert"
                                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white"
                            >
                                {missingVariables.length}
                            </div>
                        )}
                    </Button>
                </div>
                <SequenceStats
                    totalInfluencers={influencers?.length ?? 0}
                    openRate={
                        (sequenceEmails?.filter(
                            (email) =>
                                email.email_tracking_status === 'Link Clicked' ||
                                email.email_tracking_status === 'Opened',
                        ).length || 0) / (sequenceEmails?.length || 1)
                    }
                    replyRate={
                        (sequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length || 0) /
                        (sequenceEmails?.length || 1)
                    }
                    bounceRate={
                        (sequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 0) /
                        (sequenceEmails?.length || 1)
                    }
                />
                <section className="relative flex flex-row items-center justify-between border-b-2 pb-2">
                    <Tabs tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    <div
                        className="flex flex-row"
                        onClick={() => (isMissingVariables ? setShowUpdateTemplateVariables(true) : null)}
                    >
                        <Switch
                            className={`${isMissingVariables ? 'pointer-events-none' : ''}`}
                            checked={sequence?.auto_start ?? false}
                            afterLabel={t('sequences.autoStart') || ''}
                            onChange={(e) => {
                                handleAutostartToggle(e.target.checked);
                            }}
                        />
                        <Tooltip
                            content={autoStartTooltipTitle}
                            detail={autoStartTooltipDescription}
                            position="bottom-left"
                            className="w-fit"
                        >
                            <Info className="ml-2 h-3 w-3 text-gray-300" />
                        </Tooltip>
                    </div>
                </section>

                <div className="flex w-full flex-row items-center justify-between gap-4">
                    <SelectMultipleDropdown
                        text={t('sequences.steps.filter')}
                        options={emailSteps}
                        selectedOptions={filterSteps}
                        setSelectedOptions={handleStep}
                        translationPath="sequences.steps"
                    />
                    <button
                        data-testid="delete-influencers-button"
                        className="h-fit w-fit cursor-pointer rounded-md border border-red-100 p-[10px]"
                        onClick={() => {
                            if (selection.length === 0) return;
                            setShowDeleteConfirmation(true);
                        }}
                    >
                        <DeleteOutline className="h-4 w-4 stroke-red-500" />
                    </button>
                </div>
                {currentTabInfluencers && sequenceSteps ? (
                    <SequenceTable
                        sequenceInfluencers={currentTabInfluencers}
                        sequenceEmails={sequenceEmails}
                        sequenceSteps={sequenceSteps}
                        currentTab={currentTab}
                        missingVariables={missingVariables}
                        isMissingVariables={isMissingVariables}
                        setShowUpdateTemplateVariables={setShowUpdateTemplateVariables}
                        templateVariables={templateVariables ?? []}
                        handleStartSequence={handleStartSequence}
                        selection={selection}
                        setSelection={setSelection}
                    />
                ) : (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                )}
            </div>
            <DeleteFromSequenceModal
                show={showDeleteConfirmation}
                setShow={setShowDeleteConfirmation}
                deleteInfluencer={handleDelete}
                sequenceIds={selection}
            />
        </Layout>
    );
};
