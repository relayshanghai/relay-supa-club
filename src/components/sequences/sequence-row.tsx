/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';

import Link from 'next/link';
import type { SetStateAction } from 'react';
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import { Button } from '../button';
import { DeleteOutline, SendOutline } from '../icons';
import { Tooltip } from '../library';
import { TableInlineInput } from '../library/table-inline-input';
import type { EmailStatus } from './constants';

import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import toast from 'react-hot-toast';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { StartSequenceForInfluencer } from 'src/utils/analytics/events';
import { EmailPreviewModal } from './email-preview-modal';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { clientLogger } from 'src/utils/logger-client';
import { EnterInfluencerEmail } from 'src/utils/analytics/events/outreach/enter-influencer-email';
import { useReport } from 'src/hooks/use-report';
import {
    isMissingSocialProfileInfo,
    updateSequenceInfluencerIfSocialProfileAvailable,
    wasFetchedWithinMinutes,
} from './helpers';
import { randomNumber } from 'src/utils/utils';
import { checkForIgnoredEmails } from './check-for-ignored-emails';
import { EmailStatusBadge } from './email-status-badge';
import { InfluencerAvatarWithFallback } from '../library/influencer-avatar-with-fallback';

interface SequenceRowProps {
    sequence?: Sequence;
    sequenceInfluencer: SequenceInfluencerManagerPage;
    loadingEmails: boolean;
    lastEmail?: SequenceEmail;
    lastStep?: SequenceStep;
    nextStep?: SequenceStep;
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencerManagerPage['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    onCheckboxChange?: (id: string) => void;
    checked?: boolean;
    handleStartSequence: (sequenceInfluencers: SequenceInfluencerManagerPage[]) => Promise<SequenceSendPostResponse>;
}

/** use the tracking status if it is delivered */
const getStatus = (sequenceEmail: SequenceEmail | undefined): EmailStatus =>
    sequenceEmail?.email_delivery_status === 'Delivered'
        ? sequenceEmail?.email_tracking_status ?? sequenceEmail.email_delivery_status
        : sequenceEmail?.email_delivery_status ?? 'Unscheduled';

const SequenceRow: React.FC<SequenceRowProps> = ({
    sequence,
    sequenceInfluencer,
    loadingEmails,
    lastEmail,
    lastStep,
    nextStep,
    currentTab,
    missingVariables,
    isMissingVariables,
    setShowUpdateTemplateVariables,
    templateVariables,
    handleStartSequence,
    onCheckboxChange,
    checked,
}) => {
    const {
        sequenceInfluencers,
        updateSequenceInfluencer,
        deleteSequenceInfluencers: deleteSequenceInfluencer,
        refreshSequenceInfluencers,
    } = useSequenceInfluencers(sequenceInfluencer && [sequenceInfluencer.sequence_id]);
    const wasFetchedWithin1Minute = wasFetchedWithinMinutes(undefined, sequenceInfluencer, 60000);

    const missingSocialProfileInfo = isMissingSocialProfileInfo(sequenceInfluencer);

    const shouldFetch = missingSocialProfileInfo && !wasFetchedWithin1Minute;

    const { report, socialProfile } = useReport({
        platform: sequenceInfluencer.platform,
        creator_id: sequenceInfluencer.iqdata_id,
        suppressFetch: !shouldFetch,
    });

    const [submittingChangeEmail, setSubmittingChangeEmail] = useState(false);

    useEffect(() => {
        const update = async () => {
            const result =
                // See `modal-add-to-sequence`. If we weren't able to get the report during that step, we will try again here.
                await updateSequenceInfluencerIfSocialProfileAvailable({
                    sequenceInfluencer,
                    socialProfile,
                    report,
                    updateSequenceInfluencer,
                    company_id: sequenceInfluencer.company_id,
                }).catch((error: any) => {
                    // Temporarily comment out the deleteSequenceInfluencer call as it seems to be causing unexpected issues. https://relayclub.slack.com/archives/C05R1C6V553/p1700226227238909?thread_ts=1700225873.168129&cid=C05R1C6V553
                    // if (error.message.includes('Email already exists for this company')) {
                    //     // Sometimes a user adds an influencer to a sequence from both tiktok and instagram and the email is the same. More permanent solution linked below.
                    //     // https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1106

                    //     deleteSequenceInfluencer([sequenceInfluencer.id]);
                    // } else {
                    //     clientLogger(error);
                    // }
                    clientLogger(error);

                    return null;
                });
            if (result?.email) {
                setEmail(result.email);
            }
        };

        update();
    }, [deleteSequenceInfluencer, report, sequenceInfluencer, socialProfile, updateSequenceInfluencer]);

    useEffect(() => {
        checkForIgnoredEmails({
            sequenceInfluencer,
            lastEmail,
            updateSequenceInfluencer,
        });
    }, [lastEmail, sequenceInfluencer, updateSequenceInfluencer]);

    const { profile } = useUser();
    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState(sequenceInfluencer.email ?? '');
    const [showEmailPreview, setShowEmailPreview] = useState<SequenceStep[] | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const { track } = useRudderstackTrack();
    const sequenceId = sequence?.id ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const batchId = useMemo(() => randomNumber(), [sequenceId]);

    const handleChange = () => {
        onCheckboxChange && onCheckboxChange(sequenceInfluencer.id);
    };

    const handleEmailUpdate = async (email: string) => {
        try {
            const otherInfluencersEmails = sequenceInfluencers.map((influencer) =>
                influencer.email?.trim().toLowerCase(),
            );
            const uniqueEmail = !otherInfluencersEmails.includes(email);
            track(EnterInfluencerEmail, {
                sequence_id: sequence?.id || '',
                influencer_id: sequenceInfluencer.id,
                existing_email: sequenceInfluencer.email || '',
                sequence_name: sequence?.name || '',
                email: email,
                unique_email: uniqueEmail,
            });
            if (!uniqueEmail) {
                toast.error(t('sequences.emailAlreadyExists'));
                return;
            }
            const updatedSequenceInfluencer = await updateSequenceInfluencer({
                id: sequenceInfluencer.id,
                email,
                company_id: profile?.company_id ?? '', // If updating the email, also pass in the company_id so we can check if the email already exists for this company
            });
            setEmail(updatedSequenceInfluencer.email ?? '');
        } catch (error: any) {
            toast.error(error?.message ?? 'Something went wrong');
        }
    };

    const handleStart = async () => {
        setSendingEmail(true);
        try {
            const results = await handleStartSequence([sequenceInfluencer]);
            const failed = results.filter((result) => result.error);
            const succeeded = results.filter((result) => !result.error);

            track(StartSequenceForInfluencer, {
                influencer_id: sequenceInfluencer.influencer_social_profile_id,
                sequence_id: sequenceInfluencer.sequence_id,
                sequence_name: sequence?.name ?? null,
                sequence_influencer_id: sequenceInfluencer.id,
                is_success: true,
                sent_success: succeeded,
                sent_success_count: succeeded.length,
                sent_failed: failed,
                sent_failed_count: failed.length,
                batch_id: batchId,
            });

            if (succeeded.length > 0) {
                toast.success(t('sequences.number_emailsSuccessfullyScheduled', { number: succeeded.length }));
            }
            if (failed.length > 0) {
                toast.error(t('sequences.number_emailsFailedToSchedule', { number: failed.length }));
                track(StartSequenceForInfluencer, {
                    influencer_id: sequenceInfluencer.influencer_social_profile_id,
                    sequence_id: sequenceInfluencer.sequence_id,
                    sequence_name: sequence?.name ?? null,
                    sequence_influencer_id: sequenceInfluencer.id,
                    is_success: false,
                    extra_info: { error: 'sequence-row, sequences.number_emailsFailedToSchedule ' + failed.length },
                    batch_id: batchId,
                });
            }
        } catch (error: any) {
            track(StartSequenceForInfluencer, {
                influencer_id: sequenceInfluencer.influencer_social_profile_id,
                sequence_id: sequenceInfluencer.sequence_id,
                sequence_name: sequence?.name ?? null,
                sequence_influencer_id: sequenceInfluencer.id,
                is_success: false,
                extra_info: { error: String(error) },
                batch_id: batchId,
            });
            toast.error(error?.message ?? '');
        }

        setSendingEmail(false);
    };
    const handleDeleteInfluencer = async (sequenceInfluencerId: string) => {
        try {
            await deleteSequenceInfluencer([sequenceInfluencerId]);
            refreshSequenceInfluencers(
                sequenceInfluencers?.filter((influencer) => influencer.id !== sequenceInfluencerId),
            );
            toast.success(t('sequences.influencerDeleted'));
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('sequences.influencerDeleteFailed'));
        }
    };

    const isMissingSequenceSendEmail = !profile?.sequence_send_email || !profile?.email_engine_account_id;

    const sequenceSendTooltipTitle = missingSocialProfileInfo
        ? t('sequences.invalidSocialProfileTooltip')
        : !sequenceInfluencer.email
        ? t('sequences.missingEmail')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltip')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables')
        : t('sequences.sequenceSendTooltip');
    const sequenceSendTooltipDescription = missingSocialProfileInfo
        ? t('sequences.invalidSocialProfileTooltipDescription')
        : !sequenceInfluencer.email
        ? t('sequences.missingEmailTooltipDescription')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltipDescription')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables_variables', {
              variables: missingVariables,
          })
        : t('sequences.sequenceSendTooltipDescription');

    const sequenceSendTooltipHighlight = missingSocialProfileInfo
        ? t('sequences.invalidSocialProfileTooltipHighlight')
        : undefined;

    const isDuplicateInfluencer = useMemo(() => {
        return sequenceInfluencers.some((influencer) => {
            if (!influencer.id || !sequenceInfluencer.id) {
                return false;
            }
            if (influencer.id === sequenceInfluencer.id) {
                return false;
            }
            if (influencer.funnel_status !== 'To Contact') {
                return false;
            }
            return (
                (influencer.email && sequenceInfluencer.email && influencer.email === sequenceInfluencer.email) ||
                influencer.iqdata_id === sequenceInfluencer.iqdata_id
            );
        });
    }, [sequenceInfluencer.email, sequenceInfluencer.id, sequenceInfluencer.iqdata_id, sequenceInfluencers]);
    const lastEmailStatus: EmailStatus =
        sequenceInfluencer.funnel_status === 'Ignored' ? 'Ignored' : getStatus(lastEmail);

    const disableSend =
        submittingChangeEmail ||
        isMissingSequenceSendEmail ||
        !sequenceInfluencer.email ||
        sendingEmail ||
        missingSocialProfileInfo;

    return (
        <>
            <EmailPreviewModal
                visible={!!showEmailPreview}
                onClose={() => setShowEmailPreview(null)}
                sequenceSteps={showEmailPreview || []}
                templateVariables={templateVariables}
            />
            <tr className="border-b-2 border-gray-200 bg-white text-sm">
                <td className="display-none items-center whitespace-nowrap text-center align-middle">
                    <input
                        data-testid="influencer-checkbox"
                        className="select-none appearance-none rounded-sm border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                        checked={checked}
                        onChange={handleChange}
                        type="checkbox"
                    />
                </td>
                <td className="w-[275px] overflow-hidden whitespace-nowrap px-6 py-2">
                    <div className="flex flex-row items-center gap-2">
                        <InfluencerAvatarWithFallback influencer={sequenceInfluencer} />

                        <div className="flex flex-col">
                            <p className="font-semibold text-primary-600">{sequenceInfluencer.name ?? ''}</p>
                            <Link
                                className="cursor-pointer font-semibold text-gray-500"
                                href={sequenceInfluencer.url ?? ''}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                @{sequenceInfluencer.username ?? ''}
                            </Link>
                        </div>
                    </div>
                </td>
                {currentTab === 'To Contact' && (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {isDuplicateInfluencer ? (
                                <div className="text-red-500">{t('sequences.warningDuplicateInfluencer')}</div>
                            ) : !missingSocialProfileInfo ? (
                                <TableInlineInput
                                    value={email}
                                    onSubmit={async (emailSubmit) => {
                                        const trimmed = emailSubmit.trim().toLowerCase();
                                        await handleEmailUpdate(trimmed);
                                    }}
                                    onSubmittingChange={setSubmittingChangeEmail}
                                    textPromptForMissingValue={t('sequences.addEmail')}
                                />
                            ) : (
                                <div className="h-8 animate-pulse rounded-xl bg-gray-300 backdrop-blur-sm" />
                            )}
                        </td>

                        <td className="max-w-[200px] overflow-hidden whitespace-nowrap px-6 py-4 text-gray-600">
                            {!missingSocialProfileInfo ? (
                                sequenceInfluencer.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="mr-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <div className="h-8 animate-pulse rounded-xl bg-gray-300 backdrop-blur-sm" />
                            )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {new Date(sequenceInfluencer.created_at).toLocaleDateString(i18n.language, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </td>

                        <td className="mr-4 flex min-w-min items-center justify-start whitespace-nowrap px-6 py-4 text-gray-600 md:mr-0">
                            <Tooltip
                                content={sequenceSendTooltipTitle}
                                detail={sequenceSendTooltipDescription}
                                highlight={sequenceSendTooltipHighlight}
                                position="left"
                            >
                                <Button
                                    disabled={disableSend}
                                    data-testid={`send-email-button-${sequenceInfluencer.email}`}
                                    onClick={
                                        isMissingVariables ? () => setShowUpdateTemplateVariables(true) : handleStart
                                    }
                                    className={isMissingVariables ? '!border-gray-300 !bg-gray-300 !text-gray-500' : ''}
                                >
                                    <SendOutline className="mx-2 h-5 text-white" />
                                </Button>
                            </Tooltip>
                        </td>
                    </>
                )}
                {currentTab === 'In Sequence' && (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 align-middle font-semibold text-gray-600">
                            {lastStep?.name ?? ''}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 align-middle">
                            <EmailStatusBadge loading={loadingEmails} status={lastEmailStatus} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {loadingEmails ? (
                                '--'
                            ) : (
                                <>
                                    {lastEmail?.email_send_at &&
                                        new Date(lastEmail.email_send_at).toLocaleDateString(i18n.language, {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                </>
                            )}
                        </td>
                        <td className="px-6 py-4 align-middle">
                            <div className="flex">
                                <button
                                    className="w-[100px] text-primary-600"
                                    onClick={() => setShowEmailPreview(nextStep ? [nextStep] : [])}
                                >
                                    {nextStep?.name ?? '-'}
                                </button>
                                <button onClick={() => handleDeleteInfluencer(sequenceInfluencer.id)}>
                                    <DeleteOutline
                                        data-testid="delete-influencer-button"
                                        className="ml-3 h-5 w-5 text-gray-300"
                                    />
                                </button>
                            </div>
                        </td>
                    </>
                )}
                {currentTab === 'Ignored' && (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {lastEmail?.email_send_at &&
                                new Date(lastEmail.email_send_at).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4`}>
                            <EmailStatusBadge loading={loadingEmails} status={lastEmailStatus} />
                        </td>
                        {/* TODO */}
                        {/* <td className=" whitespace-nowrap px-6 py-4 text-gray-600">
                            <Button>Restart</Button>
                        </td> */}
                    </>
                )}
            </tr>
        </>
    );
};

export default SequenceRow;
