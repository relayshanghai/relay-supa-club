/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';

import { SequenceStats } from './sequence-stats';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';
import { Brackets, DeleteOutline, Info, Question, SendOutline, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import type { CommonStatusType, MultipleDropdownObject, TabsProps } from '../library';
import { Badge, FaqModal, SelectMultipleDropdown, Switch, Tabs } from '../library';
import { Button } from '../button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';
import { useTranslation } from 'react-i18next';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Tooltip } from '../library';
import { EMAIL_STEPS } from './constants';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useUser } from 'src/hooks/use-user';
import { DeleteFromSequenceModal } from '../modal-delete-from-sequence';
import toast from 'react-hot-toast';
import faq from 'i18n/en/faq';
import { useRouter } from 'next/router';
import { clientLogger } from 'src/utils/logger-client';
import { ClickNeedHelp } from 'src/utils/analytics/events';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ViewSequenceTemplates } from 'src/utils/analytics/events/outreach/view-sequence-templates';
import { Banner } from '../library/banner';
import { ChangeSequenceTab } from 'src/utils/analytics/events/outreach/change-sequence-tab';
import { ToggleAutoStart } from 'src/utils/analytics/events/outreach/toggle-auto-start';
import { FilterSequenceInfluencers } from 'src/utils/analytics/events/outreach/filter-sequence-influencers';
import type { BatchStartSequencePayload } from 'src/utils/analytics/events/outreach/batch-start-sequence';
import { BatchStartSequence } from 'src/utils/analytics/events/outreach/batch-start-sequence';
import { nextFetch } from 'src/utils/fetcher';

export const SequencePage = ({ sequenceId }: { sequenceId: string }) => {
    const { t } = useTranslation();
    const { push } = useRouter();
    const { track } = useRudderstackTrack();
    const { profile } = useUser();
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequenceId);
    const { sequenceInfluencers, deleteSequenceInfluencers, refreshSequenceInfluencers } = useSequenceInfluencers(
        sequence && [sequenceId],
    );

    const { sequenceEmails, isLoading: loadingEmails } = useSequenceEmails(sequenceId);
    const { templateVariables, refreshTemplateVariables } = useTemplateVariables(sequenceId);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => ` **${variable.name}** `) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const [filterSteps, setFilterSteps] = useState<CommonStatusType[]>([]);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

    const handleStartSequence = useCallback(
        async (sequenceInfluencersToSend: SequenceInfluencerManagerPage[]) => {
            const results = await sendSequence(sequenceInfluencersToSend);

            // handle optimistic update
            const succeeded = results.filter((result) => !result.error);
            const failed = results.filter((result) => result.error);
            refreshSequenceInfluencers((influencers) =>
                influencers?.map(
                    (influencer) => ({
                        ...influencer,
                        funnel_status: succeeded.some((i) => i.sequenceInfluencerId === influencer.id)
                            ? 'In Sequence'
                            : failed.some((i) => i.sequenceInfluencerId === influencer.id)
                            ? 'To Contact'
                            : influencer.funnel_status,
                    }),
                    { revalidate: false },
                ),
            );
            return results;
        },
        [refreshSequenceInfluencers, sendSequence],
    );

    const handleAutostartToggle = async (checked: boolean) => {
        track(ToggleAutoStart, {
            action: checked ? 'Enable' : 'Disable',
            total_sequence_influencers: sequenceInfluencers?.length,
            unstarted_sequence_influencers: sequenceInfluencers?.filter(
                (influencer) => influencer.funnel_status === 'To Contact',
            ).length,
            sequence_id: sequenceId,
            sequence_name: sequence?.name || null,
        });
        if (!sequence) {
            return;
        }
        await updateSequence({ id: sequenceId, auto_start: checked });
    };

    const [showUpdateTemplateVariables, setShowUpdateTemplateVariables] = useState(false);
    const handleOpenUpdateTemplateVariables = () => {
        track(ViewSequenceTemplates, {
            sequence_id: sequenceId,
            sequence_name: sequence?.name || '',
            variables_set: missingVariables.length === 0,
        });
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
    const [currentTab, setCurrentTabState] = useState(tabs[0].value);
    const setCurrentTab = (tab: SequenceInfluencerManagerPage['funnel_status']) => {
        track(ChangeSequenceTab, {
            current_tab: currentTab,
            selected_tab: tab,
            sequence_id: sequenceId,
            sequence_name: sequence?.name || '',
        });
        setCurrentTabState(tab);
    };
    const [selection, setSelection] = useState<string[]>([]);

    const currentTabInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === currentTab)
        : [];

    const [emailSteps, setEmailSteps] = useState<MultipleDropdownObject>(EMAIL_STEPS);

    const handleDelete = async (influencerIds: string[]) => {
        try {
            await deleteSequenceInfluencers(influencerIds);
            refreshSequenceInfluencers(sequenceInfluencers?.filter((influencer) => !selection.includes(influencer.id)));
            setSelection([]);
            toast.success(t('sequences.influencerDeleted'));
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('sequences.influencerDeleteFailed'));
        }
    };

    const handleSetSelectedOptions = useCallback(
        (filters: CommonStatusType[]) => {
            track(FilterSequenceInfluencers, {
                filter_type: filters.toString(),
                current_tab: currentTab,
                total_sequence_influencers: influencers?.length,
                total_filter_results: influencers?.filter((influencer) => filters.includes(influencer.funnel_status))
                    .length,
                sequence_id: sequenceId,
                sequence_name: sequence?.name || '',
            });
            setFilterSteps(filters);
        },
        [currentTab, influencers, sequence?.name, sequenceId, track],
    );

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

    useEffect(() => {
        refreshTemplateVariables();
    }, [refreshTemplateVariables]);

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

    const [showNeedHelp, setShowNeedHelp] = useState<boolean>(false);
    const hideAutoStart = true; // TODO: reenable when limits are set https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/817

    const selectedInfluencers = useMemo(
        () => influencers.filter((influencer) => selection.includes(influencer.id)),
        [influencers, selection],
    );

    const handleBatchSend = useCallback(
        async (batchSendInfluencers: SequenceInfluencerManagerPage[]) => {
            if (selection.length === 0) {
                return;
            }

            // remove them from selection, and optimistically update to "In Sequence"
            setSelection([]);
            refreshSequenceInfluencers(
                sequenceInfluencers.map((influencer) => {
                    if (batchSendInfluencers.some((i) => i.id === influencer.id)) {
                        return {
                            ...influencer,
                            funnel_status: 'In Sequence',
                            sequence_step: 0,
                        };
                    }
                    return influencer;
                }),
                { revalidate: false },
            );
            const trackData: BatchStartSequencePayload = {
                sequence_id: sequence?.id ?? null,
                sequence_name: sequence?.name ?? null,
                sequence_influencer_ids: batchSendInfluencers.map((si) => si.id),
                is_success: false,
                sent_success: [],
                sent_success_count: null,
                sent_failed: [],
                sent_failed_count: null,
            };

            try {
                const results = await handleStartSequence(batchSendInfluencers);
                const failed = results.filter((result) => result.error);
                const succeeded = results.filter((result) => !result.error);

                trackData.sent_success = succeeded;
                trackData.sent_success_count = succeeded.length;
                trackData.sent_failed = failed;
                trackData.sent_failed_count = failed.length;
                trackData.is_success = true;
                track(BatchStartSequence, trackData);

                if (succeeded.length > 0) {
                    toast.success(t('sequences.number_emailsSuccessfullyScheduled', { number: succeeded.length }));
                }
                if (failed.length > 0) {
                    toast.error(t('sequences.number_emailsFailedToSchedule', { number: failed.length }));
                    trackData.extra_info = {
                        error: 'sequence-page, sequences.number_emailsFailedToSchedule: ' + failed.length,
                    };
                    track(BatchStartSequence, trackData);
                }
            } catch (error: any) {
                trackData.extra_info = { error: `error: ${error?.message} \nstack: ${error?.stack}` };
                track(BatchStartSequence, trackData);
                toast.error(error?.message ?? '');
            }
        },
        [
            handleStartSequence,
            refreshSequenceInfluencers,
            selection.length,
            sequence?.id,
            sequence?.name,
            sequenceInfluencers,
            t,
            track,
        ],
    );

    const sequenceSendTooltipTitle = selectedInfluencers.some((i) => !i.influencer_social_profile_id)
        ? t('sequences.invalidSocialProfileTooltip')
        : selectedInfluencers.some((i) => !i.email)
        ? t('sequences.missingEmail')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltip')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables')
        : t('sequences.sequenceSendTooltip');
    const sequenceSendTooltipDescription = selectedInfluencers.some((i) => !i.influencer_social_profile_id)
        ? t('sequences.invalidSocialProfileTooltipDescription')
        : selectedInfluencers.some((i) => !i.email)
        ? t('sequences.missingEmailTooltipDescription')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltipDescription')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables_variables', {
              variables: missingVariables,
          })
        : t('sequences.sequenceBatchSendTooltipDescription');
    const sequenceSendTooltipHighlight = selectedInfluencers.some((i) => !i.influencer_social_profile_id)
        ? t('sequences.invalidSocialProfileTooltipHighlight')
        : undefined;
    return (
        <Layout>
            {!profile?.email_engine_account_id && (
                <Banner
                    buttonText={t('banner.button')}
                    title={t('banner.outreach.title')}
                    message={t('banner.outreach.descriptionSequences')}
                />
            )}
            <Button
                onClick={async () => {
                    const res = await nextFetch('fix');
                    // eslint-disable-next-line no-console
                    console.log(res);
                }}
            >
                FIX DATA
            </Button>
            <FaqModal
                title={t('faq.sequencesTitle')}
                visible={showNeedHelp}
                onClose={() => setShowNeedHelp(false)}
                content={faq.sequences.map((_, i) => ({
                    title: t(`faq.sequences.${i}.title`),
                    detail: t(`faq.sequences.${i}.detail`),
                }))}
                getMoreInfoButtonText={t('faq.sequencesGetMoreInfo') || ''}
                getMoreInfoButtonAction={() => push('/guide')}
                source="Sequence"
            />
            <TemplateVariablesModal
                sequenceId={sequenceId}
                sequenceName={sequence?.name}
                visible={showUpdateTemplateVariables}
                onClose={() => setShowUpdateTemplateVariables(false)}
                sequenceSteps={sequenceSteps ?? []}
                templateVariables={templateVariables ?? []}
            />
            <div className="flex flex-col p-6 ">
                <div className="mb-6 flex w-full gap-6">
                    <h1 className="mr-4 self-center text-3xl font-semibold text-gray-800">{sequence?.name}</h1>
                    <Button
                        onClick={handleOpenUpdateTemplateVariables}
                        variant="secondary"
                        className="relative flex border-primary-600 bg-white text-primary-600"
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
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setShowNeedHelp(true);
                            track(ClickNeedHelp);
                        }}
                        className="ml-auto flex items-center"
                    >
                        {t('website.needHelp')}
                        <Question className="ml-2 h-6 w-6" />
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
                <section className="relative flex w-full flex-1 flex-row items-center justify-between border-b-2 pt-11">
                    <Tabs tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    {hideAutoStart ? null : (
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
                    )}
                </section>

                <div className="flex w-full flex-col gap-4 overflow-x-auto pt-9">
                    <div className="sticky left-0 flex w-full flex-row items-center justify-between">
                        <SelectMultipleDropdown
                            text={t('sequences.steps.filter')}
                            options={emailSteps}
                            selectedOptions={filterSteps}
                            setSelectedOptions={handleSetSelectedOptions}
                            translationPath="sequences.steps"
                        />
                        <div className="flex space-x-4">
                            <button
                                data-testid="delete-influencers-button"
                                className={`h-fit ${
                                    selection.length === 0 && 'hidden'
                                } w-fit cursor-pointer rounded-md border border-red-100 p-[10px]`}
                                onClick={() => {
                                    if (selection.length === 0) return;
                                    setShowDeleteConfirmation(true);
                                }}
                            >
                                <DeleteOutline className="h-4 w-4 stroke-red-500" />
                            </button>
                            {selection.length > 0 && (
                                <Tooltip
                                    content={sequenceSendTooltipTitle}
                                    detail={sequenceSendTooltipDescription}
                                    highlight={sequenceSendTooltipHighlight}
                                    position="bottom-left"
                                >
                                    <Button
                                        disabled={
                                            isMissingSequenceSendEmail ||
                                            selectedInfluencers.some((i) => !i?.email) ||
                                            selectedInfluencers.some((i) => !i?.influencer_social_profile_id)
                                        }
                                        className={
                                            isMissingVariables
                                                ? 'flex !border-gray-300 !bg-gray-300 !text-gray-500'
                                                : 'flex'
                                        }
                                        onClick={
                                            isMissingVariables
                                                ? () => setShowUpdateTemplateVariables(true)
                                                : () => handleBatchSend(selectedInfluencers)
                                        }
                                    >
                                        <SendOutline className="mr-2 h-5 w-5 stroke-white" />
                                        {t('sequences.startSelectedSequences')}
                                    </Button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div>
                        {currentTabInfluencers && sequenceSteps ? (
                            <SequenceTable
                                sequence={sequence}
                                sequenceInfluencers={currentTabInfluencers}
                                sequenceEmails={sequenceEmails}
                                loadingEmails={loadingEmails}
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
                </div>
            </div>
            <DeleteFromSequenceModal
                show={showDeleteConfirmation}
                setShow={setShowDeleteConfirmation}
                deleteHandler={handleDelete}
                influencerIds={selection}
            />
        </Layout>
    );
};
