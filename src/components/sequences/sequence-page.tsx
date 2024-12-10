/* eslint-disable complexity */
import { Layout } from '../layout';
import SequenceTable from './sequence-table';

import { SequenceStats } from './sequence-stats';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';
import { DeleteOutline, Info, Question, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import type { CommonStatusType, MultipleDropdownObject, TabsProps } from '../library';
import { Badge, FaqModal, Switch } from '../library';
import { Button } from '../button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';
import { useTranslation } from 'react-i18next';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { Tooltip } from '../library';
import { EMAIL_STEPS } from './constants';
import type {
    SequenceInfluencerManagerPageWithChannelData,
    SequenceInfluencerManagerPage,
} from 'pages/api/sequence/influencers';
import { useUser } from 'src/hooks/use-user';
import { DeleteFromSequenceModal } from '../modal-delete-from-sequence';
import toast from 'react-hot-toast';
import faq from 'i18n/en/faq';
import { useRouter } from 'next/router';
import { clientLogger } from 'src/utils/logger-client';
import { ClickNeedHelp } from 'src/utils/analytics/events';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { Banner } from '../library/banner';
import { ToggleAutoStart } from 'src/utils/analytics/events/outreach/toggle-auto-start';
import { useSequenceSteps } from 'src/hooks/use-sequence-steps';
import { calculateReplyRate } from './helpers';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { discoveryInfluencerGuide, emailTemplateModal, outreachInfluencerGuide } from 'src/guides/crm.guide';
import { filterByPage } from 'src/utils/filter-sort/influencer';
import { downloadFile } from 'src/utils/file/download-fe';
import { useSubscription } from 'src/hooks/v2/use-subscription';
import { type SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import { isTrial } from 'src/utils/subscription';

export const SequencePage = ({ sequenceId }: { sequenceId: string }) => {
    const { t } = useTranslation();
    const { push } = useRouter();
    const { track } = useRudderstackTrack();
    const { profile } = useUser();
    const { subscription } = useSubscription();
    const { sequence, sendSequence, updateSequence } = useSequence(sequenceId);
    const { sequenceSteps } = useSequenceSteps(sequenceId);
    const {
        sequenceInfluencers,
        deleteSequenceInfluencers,
        refreshSequenceInfluencers,
        updateSequenceInfluencer,
        exportInfluencersToCsv,
    } = useSequenceInfluencers(sequence && [sequenceId]);

    const { sequenceEmails, isLoading: loadingEmails } = useSequenceEmails(sequenceId);
    const { templateVariables, refreshTemplateVariables } = useTemplateVariables(sequenceId);
    const missingVariables = templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => ` **${variable.name}** `) ?? ['Error retrieving variables'];
    const isMissingVariables = !templateVariables || templateVariables.length === 0 || missingVariables.length > 0;

    const [filterSteps] = useState<CommonStatusType[]>([]);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const influencers = useMemo<SequenceInfluencerManagerPageWithChannelData[]>(() => {
        if (!sequenceInfluencers) {
            return [];
        }
        if (filterSteps.length === 0) {
            return sequenceInfluencers.filter(
                (influencer) =>
                    influencer.funnel_status === 'To Contact' ||
                    influencer.funnel_status === 'In Sequence' ||
                    influencer.funnel_status === 'Ignored',
            );
        }
        const filteredInfluencers = sequenceInfluencers
            .filter(
                (influencer) =>
                    influencer.funnel_status === 'To Contact' ||
                    influencer.funnel_status === 'In Sequence' ||
                    influencer.funnel_status === 'Ignored',
            )
            .filter((influencer) => {
                const step = sequenceSteps?.find((step) => step.step_number === influencer.sequence_step);
                return step && step.name && filterSteps.includes(step.name);
            });
        return filteredInfluencers;
    }, [filterSteps, sequenceInfluencers, sequenceSteps]);

    const handleStartSequence = useCallback(
        async (sequenceInfluencersToSend: SequenceInfluencerManagerPageWithChannelData[]) => {
            try {
                if (!sequenceSteps || sequenceSteps.length === 0) {
                    throw new Error('Sequence steps not found');
                }
                const results = await sendSequence(sequenceInfluencersToSend, sequenceSteps);

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
            } catch (error) {
                clientLogger(error, 'error');
                toast.error(t('sequences.sequenceScheduleFailed'));

                return [];
            }
        },
        [refreshSequenceInfluencers, sendSequence, sequenceSteps, t],
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
    const [currentTab] = useState(tabs[0].value);
    const [selection, setSelection] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const currentTabInfluencers = influencers
        ? influencers.filter((influencer) => influencer.funnel_status === currentTab)
        : [];

    const [, setEmailSteps] = useState<MultipleDropdownObject>(EMAIL_STEPS);

    const handleDelete = async (influencerIds: string[]) => {
        try {
            refreshSequenceInfluencers(
                sequenceInfluencers?.filter((influencer) => !selection.includes(influencer.id)),
                { revalidate: false },
            );
            await deleteSequenceInfluencers(influencerIds);
            setSelection([]);
            toast.success(t('sequences.influencerDeleted'));
        } catch (error) {
            refreshSequenceInfluencers(sequenceInfluencers);
            clientLogger(error, 'error');
            toast.error(t('sequences.influencerDeleteFailed'));
        }
    };

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

    const replyRate = useMemo(
        () => calculateReplyRate(sequenceInfluencers, sequenceEmails),
        [sequenceInfluencers, sequenceEmails],
    );

    const [showSlowBanner, setShowSlowBanner] = useState(false);

    const { setGuides, startTour, guidesReady, guiding } = useDriverV2();

    useEffect(() => {
        setGuides({
            'sequence#detail': isMissingSequenceSendEmail ? discoveryInfluencerGuide : outreachInfluencerGuide,
            'emailTemplate#modal': emailTemplateModal,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            currentTabInfluencers.length > 0 &&
            sequenceSteps &&
            guidesReady &&
            currentTabInfluencers.length > 0 &&
            sequenceSteps
        ) {
            startTour('sequence#detail');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady, currentTabInfluencers.length, sequenceSteps, currentTabInfluencers.length, sequenceSteps]);

    useEffect(() => {
        if (!guiding && showUpdateTemplateVariables) {
            startTour('emailTemplate#modal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guiding, showUpdateTemplateVariables]);

    const exportButtonText = () => {
        if (selection.length > 0) {
            return t('sequences.exportSelected');
        } else {
            return t('sequences.exportPage');
        }
    };

    const handleExport = async () => {
        const filtered = filterByPage(currentPage, 25, currentTabInfluencers);
        exportInfluencersToCsv(selection.length > 0 ? selection : filtered.map((i) => i.id))
            .then((res) => downloadFile(res, `exported-${sequence?.name}-influencer-${Date.now()}.csv`))
            .catch((e) => {
                const status = e?.response?.status;
                if (status === 422) {
                    toast.error('Insufficient credits to export');
                } else {
                    toast.error('Error exporting');
                }
                clientLogger(e);
            });
    };

    return (
        <Layout>
            <Banner
                title={t('banner.sequencePageSlow.title')}
                show={showSlowBanner}
                setShow={setShowSlowBanner}
                message={t('banner.sequencePageSlow.description')}
                orientation="vertical"
                dismissable
            />
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
                    {/* hide help button */}
                    {false && (
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
                    )}
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
                    replyRate={replyRate}
                    bounceRate={
                        (sequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 0) /
                        (sequenceEmails?.length || 1)
                    }
                />
                <section className="relative flex w-full flex-1 flex-row items-center justify-between">
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
                    <div className="flex w-full flex-row items-center justify-end">
                        <div className="flex space-x-4">
                            {/* hide export button for now */}
                            {!isTrial(subscription?.status as SubscriptionStatus) && (
                                <Button onClick={() => handleExport()}>{exportButtonText()}</Button>
                            )}
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
                        </div>
                    </div>
                    <div>
                        {currentTabInfluencers && sequenceSteps ? (
                            <SequenceTable
                                sequence={sequence}
                                sequenceInfluencers={currentTabInfluencers}
                                updateSequenceInfluencer={updateSequenceInfluencer}
                                refreshSequenceInfluencers={refreshSequenceInfluencers}
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
                                setCurrentPage={(page) => setCurrentPage(page)}
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
