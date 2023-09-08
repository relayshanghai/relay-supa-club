/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';

import { SequenceStats } from './sequence-stats';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';
import { Brackets, Info, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import type { CommonStatusType, MultipleDropdownObject, TabsProps } from '../library';
import { Badge, SelectMultipleDropdown, Switch, Tabs } from '../library';
import { Button } from '../button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';
import { useTranslation } from 'react-i18next';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Tooltip } from '../library';
import { EMAIL_STEPS } from './constants';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useUser } from 'src/hooks/use-user';

export const SequencePage = ({ sequenceId }: { sequenceId: string }) => {
    const { t } = useTranslation();
    const { profile } = useUser();
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequenceId);
    const { sequenceInfluencers, refreshSequenceInfluencers } = useSequenceInfluencers(sequence && [sequenceId]);
    const { sequenceEmails } = useSequenceEmails(sequenceId);
    const { templateVariables } = useTemplateVariables(sequenceId);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => ` **${variable.name}** `) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const [filterSteps, setFilterSteps] = useState<CommonStatusType[]>([]);

    const influencers = useMemo<SequenceInfluencerManagerPage[]>(() => {
        if (!sequenceInfluencers) {
            return [];
        }
        if (filterSteps.length === 0) {
            return sequenceInfluencers;
        }
        const filteredInfluencers = sequenceInfluencers.filter((influencer) => {
            const step = sequenceSteps?.find((step) => step.step_number === influencer.sequence_step);
            return step && step.name && filterSteps.includes(step.name);
        });
        return filteredInfluencers;
    }, [filterSteps, sequenceInfluencers, sequenceSteps]);

    const handleSetSelectedOptions = useCallback(
        (filters: CommonStatusType[]) => {
            setFilterSteps(filters);
        },
        [setFilterSteps],
    );

    const handleStartSequence = async (sequenceInfluencers: SequenceInfluencerManagerPage[]) => {
        const results = await sendSequence(sequenceInfluencers);
        try {
            // handle optimistic update
            const succeeded = results.filter((result) => !result.error);
            if (succeeded.length > 0) {
                const succeededInfluencerIds = succeeded.map(({ sequenceInfluencerId }) => sequenceInfluencerId);

                const updatedInfluencers: SequenceInfluencerManagerPage[] = sequenceInfluencers.map((influencer) => {
                    if (succeededInfluencerIds.includes(influencer.id)) {
                        return {
                            ...influencer,
                            funnel_status: 'In Sequence',
                            sequence_step: 1,
                        };
                    }
                    return influencer;
                });
                refreshSequenceInfluencers(updatedInfluencers, { revalidate: false });
            }
            // shouldn't need to update failed
        } catch (error) {
            return results;
        }

        return results;
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

    const needsAttentionInfluencers = influencers.filter((influencer) => influencer.funnel_status === 'To Contact');
    const inSequenceInfluencers = influencers.filter((influencer) => influencer.funnel_status === 'In Sequence');
    const ignoredInfluencers = influencers.filter((influencer) => influencer.funnel_status === 'Ignored');
    const tabs: TabsProps<SequenceInfluencerManagerPage['funnel_status']>['tabs'] = [
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

    const currentTabInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === currentTab)
        : [];

    const [emailSteps, setEmailSteps] = useState<MultipleDropdownObject>(EMAIL_STEPS);

    const setEmailStepValues = useCallback(
        (influencers: SequenceInfluencerManagerPage[], options: MultipleDropdownObject) => {
            const emailOptionsWithValue = options;
            Object.keys(EMAIL_STEPS).forEach((option) => {
                emailOptionsWithValue[option as CommonStatusType] = {
                    ...(options[option as CommonStatusType] || {}),
                    value: influencers
                        ? influencers.filter((influencer) => {
                              const step = sequenceSteps?.find((step) => step.step_number === influencer.sequence_step);
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

                <div className="flex flex-row gap-4">
                    <SelectMultipleDropdown
                        text={t('sequences.steps.filter')}
                        options={emailSteps}
                        selectedOptions={filterSteps}
                        setSelectedOptions={handleSetSelectedOptions}
                        translationPath="sequences.steps"
                    />
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
                    />
                ) : (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                )}
            </div>
        </Layout>
    );
};
