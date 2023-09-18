/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';
import { useInfluencerSocialProfile } from 'src/hooks/use-influencer-social-profile';

import Link from 'next/link';
import type { SetStateAction } from 'react';
import { useState } from 'react';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import { imgProxy } from 'src/utils/fetcher';
import { Button } from '../button';
import { AlertCircleOutline, Clock, DeleteOutline, EmailOpenOutline, Send, SendOutline } from '../icons';
import { Tooltip } from '../library';
import { TableInlineInput } from '../library/table-inline-input';
import { EMAIL_STATUS_STYLES } from './constants';

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

interface SequenceRowProps {
    sequence?: Sequence;
    sequenceInfluencer: SequenceInfluencerManagerPage;
    lastEmail?: SequenceEmail;
    nextEmail?: SequenceEmail;
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

const Icons = {
    Opened: <EmailOpenOutline className="h-4 w-4 stroke-blue-500" />,
    Scheduled: <Clock className="h-4 w-4 stroke-yellow-500" />,
    Bounced: <AlertCircleOutline className="h-4 w-4 stroke-red-500" />,
    Delivered: <Send className="h-4 w-4 stroke-green-500" />,
    Default: <Send className="h-4 w-4 stroke-gray-500" />,
};

/** use the tracking status if it is delivered */
const getStatus = (sequenceEmail: SequenceEmail | undefined) =>
    sequenceEmail?.email_delivery_status === 'Delivered'
        ? sequenceEmail.email_tracking_status ?? sequenceEmail.email_delivery_status
        : sequenceEmail?.email_delivery_status;

const SequenceRow: React.FC<SequenceRowProps> = ({
    sequence,
    sequenceInfluencer,
    lastEmail,
    nextEmail,
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
    // add use report. suppress the report if the influencer already has a social_profile_id ? or check something else?
    // call updateSequenceInfluencerIfSocialProfileAvailable with a useEffect on the report. //when to call?
    // check social profile last updated at if there is no social_profile_id
    const now = new Date();
    const socialProfileLastFetched = new Date(sequenceInfluencer.social_profile_last_fetched);
    const wasFetchedWithin10Minutes = now - socialProfileLastFetched < 10 * 60 * 1000;

    useReport({
        platform: sequenceInfluencer.platform,
        creator_id: sequenceInfluencer.iqdata_id,
        suppressFetch: wasFetchedWithin10Minutes,
    });

    const { profile } = useUser();
    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState(sequenceInfluencer.email ?? '');
    const [showEmailPreview, setShowEmailPreview] = useState<SequenceStep[] | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const { track } = useRudderstackTrack();

    const handleChange = () => {
        onCheckboxChange && onCheckboxChange(sequenceInfluencer.id);
    };

    const handleEmailUpdate = async (email: string) => {
        try {
            const otherInfluencersEmails = sequenceInfluencers.map((influencer) => influencer.email);
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
                sequence_influencer_id: sequenceInfluencer.id,
                is_success: true,
                sent_success: succeeded,
                sent_success_count: succeeded.length,
                sent_failed: failed,
                sent_failed_count: failed.length,
            });

            if (succeeded.length > 0) {
                toast.success(t('sequences.number_emailsSuccessfullyScheduled', { number: succeeded.length }));
            }
            if (failed.length > 0) {
                toast.error(t('sequences.number_emailsFailedToSchedule', { number: failed.length }));
                track(StartSequenceForInfluencer, {
                    influencer_id: sequenceInfluencer.influencer_social_profile_id,
                    sequence_id: sequenceInfluencer.sequence_id,
                    sequence_influencer_id: sequenceInfluencer.id,
                    is_success: false,
                    extra_info: { error: 'sequence-row, sequences.number_emailsFailedToSchedule' },
                });
            }
        } catch (error: any) {
            track(StartSequenceForInfluencer, {
                influencer_id: sequenceInfluencer.influencer_social_profile_id,
                sequence_id: sequenceInfluencer.sequence_id,
                sequence_influencer_id: sequenceInfluencer.id,
                is_success: false,
                extra_info: { error: String(error) },
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

    const sequenceSendTooltipTitle = isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltip')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables')
        : t('sequences.sequenceSendTooltip');
    const sequenceSendTooltipDescription = isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltipDescription')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables_variables', {
              variables: missingVariables,
          })
        : t('sequences.sequenceSendTooltipDescription');
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
                <td className="whitespace-nowrap px-6 py-2">
                    <div className="flex flex-row items-center gap-2">
                        <img
                            className="inline-block h-14 w-14 bg-slate-300"
                            src={imgProxy(sequenceInfluencer.avatar_url ?? '')}
                            alt={`Influencer avatar ${sequenceInfluencer.name}`}
                        />

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
                            <TableInlineInput
                                value={email}
                                onSubmit={handleEmailUpdate}
                                textPromptForMissingValue={t('sequences.addEmail')}
                            />
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {sequenceInfluencer.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="mr-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                                >
                                    {tag}
                                </span>
                            ))}
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
                                position="left"
                            >
                                <Button
                                    disabled={isMissingSequenceSendEmail || !sequenceInfluencer?.email || sendingEmail}
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
                            <span
                                className={`flex w-fit flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
                                    EMAIL_STATUS_STYLES[getStatus(lastEmail || nextEmail) || 'Default'].style
                                }`}
                            >
                                {Icons[getStatus(lastEmail || nextEmail) as keyof typeof Icons] || Icons.Default}
                                {getStatus(lastEmail || nextEmail)}
                            </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {lastEmail?.email_send_at &&
                                new Date(lastEmail.email_send_at).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </td>
                        <td className="px-6 py-4 align-middle">
                            <div className="flex">
                                <button
                                    className="text-primary-600"
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
                            <div
                                className={`flex w-fit flex-row items-center justify-center gap-2 rounded-lg px-3 py-2 text-center ${
                                    EMAIL_STATUS_STYLES[getStatus(lastEmail) || 'Default']
                                }`}
                            >
                                {Icons[getStatus(lastEmail) as keyof typeof Icons] || Icons.Default}
                                {getStatus(lastEmail)}
                            </div>
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
