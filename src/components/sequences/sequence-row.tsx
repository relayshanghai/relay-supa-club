/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';

import Link from 'next/link';
import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type {
    Sequence,
    SequenceEmail,
    SequenceInfluencerUpdate,
    SequenceStep,
    TemplateVariable,
} from 'src/utils/api/db';
import { Button } from '../button';
import { DeleteOutline, Retry, ReportOutline } from '../icons';
import { Tooltip } from '../library';
import { TableInlineInput } from '../library/table-inline-input';
import type { EmailStatus } from './constants';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import toast from 'react-hot-toast';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { EmailPreviewModal } from './email-preview-modal';
import type {
    SequenceInfluencerManagerPage,
    SequenceInfluencerManagerPageWithChannelData,
} from 'pages/api/sequence/influencers';
import { clientLogger } from 'src/utils/logger-client';
import { EnterInfluencerEmail } from 'src/utils/analytics/events/outreach/enter-influencer-email';
import {
    isMissingSocialProfileInfo,
    updateSequenceInfluencerIfSocialProfileAvailable,
    wasFetchedWithinMinutes,
} from './helpers';
import { checkForIgnoredEmails } from './check-for-ignored-emails';
import { EmailStatusBadge } from './email-status-badge';
import { InfluencerAvatarWithFallback } from '../library/influencer-avatar-with-fallback';
import { useAtom } from 'jotai';
import { submittingChangeEmailAtom } from 'src/atoms/sequence-row-email-updating';
import type { KeyedMutator } from 'swr';
import { generateUrlIfTiktok } from 'src/utils/outreach/helpers';
import { type Nullable } from 'types/nullable';
import { usageErrors } from 'src/errors/usages';
import { useReportV2 } from 'src/hooks/v2/use-report';

interface SequenceRowProps {
    sequence?: Sequence;
    sequenceInfluencer: SequenceInfluencerManagerPageWithChannelData;
    sequenceInfluencers: SequenceInfluencerManagerPageWithChannelData[];
    updateSequenceInfluencer: (i: SequenceInfluencerUpdate) => Promise<SequenceInfluencerManagerPageWithChannelData>;
    refreshSequenceInfluencers: KeyedMutator<SequenceInfluencerManagerPageWithChannelData[]>;
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
    handleStartSequence: (
        sequenceInfluencers: SequenceInfluencerManagerPageWithChannelData[],
    ) => Promise<SequenceSendPostResponse>;
    handleReportIconTab?: () => void;
}

/** use the tracking status if it is delivered */
const getStatus = (sequenceEmail: SequenceEmail | undefined): EmailStatus =>
    sequenceEmail?.email_delivery_status === 'Delivered'
        ? sequenceEmail?.email_tracking_status ?? sequenceEmail.email_delivery_status
        : sequenceEmail?.email_delivery_status ?? 'Unscheduled';

const ErrorDisplay: React.FC<{ message: string; status: Nullable<string>; onClick: () => void }> = ({
    message,
    status,
    onClick,
}) => {
    const { t } = useTranslation();
    if (status === usageErrors.limitExceeded) {
        return (
            <Tooltip content={t('usages.limitExceeded')} detail={t('sequences.limitExceeded')} position="bottom-right">
                <div className="text-red-500">{t('usages.limitExceeded')}</div>
            </Tooltip>
        );
    }
    if (message === 'server_busy') {
        return (
            <div className="flex items-center gap-2">
                <div className="text-red-500">{t('sequences.reportServerBusy')}</div>

                <Tooltip content={t('sequences.retryButton')} detail={t('sequences.clickToRetry')} position="right">
                    <Button data-testid={`retry-button`} onClick={onClick} className={'!px-1 !py-2'}>
                        <Retry className="mx-2 h-5 stroke-2 text-white" />
                    </Button>
                </Tooltip>
            </div>
        );
    }
    return <div className="text-red-500">{t(`sequences.${message}`) || message}</div>;
};

const SequenceRow: React.FC<SequenceRowProps> = ({
    sequence,
    sequenceInfluencer,
    updateSequenceInfluencer,
    refreshSequenceInfluencers,
    sequenceInfluencers,
    loadingEmails,
    lastEmail,
    lastStep,
    nextStep,
    currentTab,
    templateVariables,
    onCheckboxChange,
    checked,
    handleReportIconTab,
}) => {
    const { deleteSequenceInfluencers } = useSequenceInfluencers();
    const wasFetchedWithin1Minute = wasFetchedWithinMinutes(undefined, sequenceInfluencer, 60000);

    const missingSocialProfileInfo = isMissingSocialProfileInfo(sequenceInfluencer);

    const shouldFetch = missingSocialProfileInfo && !wasFetchedWithin1Minute;

    const { report, socialProfile, errorMessage, errorStatus, refreshReport, loading } = useReportV2({
        platform: sequenceInfluencer.platform,
        creator_id: sequenceInfluencer.iqdata_id,
        suppressFetch: !shouldFetch,
    });
    const Icon = sequenceInfluencer.url?.includes('youtube')
        ? Youtube
        : sequenceInfluencer.url?.includes('tiktok')
        ? Tiktok
        : Instagram;

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
                    clientLogger(error);
                    return null;
                });
            if (result?.email) {
                setEmail(result.email);
            }
        };

        update();
    }, [report, sequenceInfluencer, socialProfile, updateSequenceInfluencer]);

    useEffect(() => {
        checkForIgnoredEmails({
            sequenceInfluencer,
            lastEmail,
            updateSequenceInfluencer,
        });
    }, [lastEmail, sequenceInfluencer, updateSequenceInfluencer]);

    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState(sequenceInfluencer.email ?? '');
    const [showEmailPreview, setShowEmailPreview] = useState<SequenceStep[] | null>(null);
    const { track } = useRudderstackTrack();

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
            // if (!uniqueEmail) {
            //     toast.error(t('sequences.emailAlreadyExists'));
            //     return;
            // }
            const updatedSequenceInfluencer = await updateSequenceInfluencer({
                id: sequenceInfluencer.id,
                email,
                // company_id: profile?.company_id ?? '', // If updating the email, also pass in the company_id so we can check if the email already exists for this company
            });
            setEmail(updatedSequenceInfluencer.email ?? '');
        } catch (error: any) {
            toast.error(error?.message ?? 'Something went wrong');
        }
    };

    const handleDeleteInfluencer = async (sequenceInfluencerId: string) => {
        try {
            await deleteSequenceInfluencers([sequenceInfluencerId]);
            refreshSequenceInfluencers(
                sequenceInfluencers?.filter((influencer) => influencer.id !== sequenceInfluencerId),
            );
            toast.success(t('sequences.influencerDeleted'));
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('sequences.influencerDeleteFailed'));
        }
    };

    const lastEmailStatus: EmailStatus =
        sequenceInfluencer.funnel_status === 'Ignored' ? 'Ignored' : getStatus(lastEmail);

    const [, setSubmittingChangeEmail] = useAtom(submittingChangeEmailAtom);

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
                        <div className="relative h-12 w-12 flex-shrink-0">
                            <>
                                <InfluencerAvatarWithFallback
                                    url={sequenceInfluencer.avatar_url || ''}
                                    name={sequenceInfluencer.name}
                                    className="rounded-full"
                                    size={48}
                                />

                                <Icon className="absolute -bottom-1 -right-2 h-6 w-6" />
                            </>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="font-semibold text-primary-600">{sequenceInfluencer.name ?? ''}</p>
                            <Link
                                className="cursor-pointer font-semibold text-gray-500"
                                href={generateUrlIfTiktok(sequenceInfluencer.url, sequenceInfluencer.username ?? '')}
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
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600" id="sequence-creator-email">
                            {loading ? (
                                <div className="h-8 animate-pulse rounded-xl bg-gray-300 backdrop-blur-sm" />
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
                            ) : errorMessage ? (
                                <ErrorDisplay
                                    message={errorMessage}
                                    status={errorStatus}
                                    onClick={() => {
                                        refreshReport();
                                    }}
                                />
                            ) : (
                                <TableInlineInput
                                    value={email}
                                    onSubmit={async (emailSubmit) => {
                                        const trimmed = emailSubmit.trim().toLowerCase();
                                        await handleEmailUpdate(trimmed);
                                    }}
                                    onSubmittingChange={setSubmittingChangeEmail}
                                    textPromptForMissingValue={t('sequences.addEmail')}
                                />
                            )}
                        </td>

                        <td className="max-w-[200px] overflow-hidden whitespace-nowrap px-6 py-4 text-gray-600">
                            {!missingSocialProfileInfo || !loading ? (
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
                            {/* <Tooltip
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
                                    id="sequence-send-button"
                                >
                                    <SendOutline className="mx-2 h-5 text-white" />
                                </Button>
                            </Tooltip> */}
                            {handleReportIconTab && (
                                <div className="ml-5 cursor-pointer">
                                    <ReportOutline
                                        className="stroke-gray-400 stroke-2"
                                        onClick={() => handleReportIconTab && handleReportIconTab()}
                                    />
                                </div>
                            )}
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
