/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';
import { useInfluencerSocialProfile } from 'src/hooks/use-influencer-social-profile';

import type { SequenceInfluencer, SequenceEmail, SequenceStep, TemplateVariable } from 'src/utils/api/db';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useState } from 'react';
import type { SetStateAction } from 'react';
import { TableInlineInput } from '../library/table-inline-input';
import { Button } from '../button';
import { AlertCircleOutline, Clock, EmailOpenOutline, Send, Brackets, DeleteOutline, SendOutline } from '../icons';
import { Tooltip } from '../library';
import { EMAIL_STATUS_STYLES } from './constants';

import { EmailPreviewModal } from './email-preview-modal';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';
import toast from 'react-hot-toast';

interface SequenceRowProps {
    sequenceInfluencer: SequenceInfluencer;
    sequenceEmail?: SequenceEmail;
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencer['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
    handleStartSequence: (sequenceInfluencers: SequenceInfluencer[]) => Promise<SequenceSendPostResponse>;
}

const Icons = ({ status }: { status?: string }) => {
    switch (status) {
        case 'Opened':
            return <EmailOpenOutline className="h-6 w-6 stroke-blue-500" />;
        case 'Scheduled':
            return <Clock className="h-6 w-6 stroke-yellow-500" />;
        case 'Bounced':
            return <AlertCircleOutline className="h-6 w-6 stroke-red-500" />;
        case 'Delivered':
            return <Send className="h-6 w-6 stroke-green-500" />;
        default:
            return null;
    }
};

/** use the tracking status if it is delivered */
const getStatus = (sequenceEmail: SequenceEmail | undefined) =>
    sequenceEmail?.email_delivery_status === 'Delivered'
        ? sequenceEmail.email_tracking_status ?? sequenceEmail.email_delivery_status
        : sequenceEmail?.email_delivery_status;

const SequenceRow: React.FC<SequenceRowProps> = ({
    sequenceInfluencer,
    sequenceEmail,
    sequenceSteps,
    currentTab,
    missingVariables,
    isMissingVariables,
    setShowUpdateTemplateVariables,
    templateVariables,
    handleStartSequence,
}) => {
    const { influencerSocialProfile } = useInfluencerSocialProfile(sequenceInfluencer.influencer_social_profile_id);
    const { updateSequenceInfluencer, deleteSequenceInfluencer } = useSequenceInfluencers(
        sequenceInfluencer && [sequenceInfluencer.sequence_id],
    );
    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState(sequenceInfluencer.email ?? '');
    const [showEmailPreview, setShowEmailPreview] = useState<SequenceStep[] | null>(null);

    const handleEmailUpdate = async (email: string) => {
        const updatedSequenceInfluencer = await updateSequenceInfluencer({ id: sequenceInfluencer.id, email });
        setEmail(updatedSequenceInfluencer.email ?? '');
    };
    const currentStep = sequenceSteps?.find((step) => step.step_number === sequenceInfluencer.sequence_step);
    const handleStart = async () => {
        try {
            const results = await handleStartSequence([sequenceInfluencer]);
            const failed = results.filter((result) => result.error);
            const succeeded = results.filter((result) => !result.error);
            if (succeeded.length > 0) {
                toast.success(t('sequences.number_emailsSuccessfullyScheduled', { number: succeeded.length }));
            }
            if (failed.length > 0) {
                toast.error(t('sequences.number_emailsFailedToSchedule', { number: failed.length }));
            }
        } catch (error: any) {
            toast.error(error?.message ?? '');
        }
    };
    return (
        <>
            <EmailPreviewModal
                visible={!!showEmailPreview}
                onClose={() => setShowEmailPreview(null)}
                sequenceSteps={showEmailPreview || []}
                templateVariables={templateVariables}
            />
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="whitespace-nowrap px-6 py-2">
                    <div className="flex flex-row items-center gap-2">
                        <div>
                            <img
                                className="inline-block h-14 w-14 bg-slate-300"
                                src={imgProxy(influencerSocialProfile?.avatar_url ?? '')}
                                alt={`Influencer avatar ${influencerSocialProfile?.name}`}
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="font-semibold text-primary-600">{influencerSocialProfile?.name ?? ''}</p>
                            <Link
                                className="cursor-pointer font-semibold text-gray-500"
                                href={influencerSocialProfile?.url ?? ''}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                @{influencerSocialProfile?.username ?? ''}
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

                        <td className="flex min-w-min items-center whitespace-nowrap px-6 py-4 text-gray-600">
                            <Tooltip
                                content={
                                    isMissingVariables
                                        ? t('sequences.missingRequiredTemplateVariables_variables', {
                                              variables: missingVariables,
                                          })
                                        : ''
                                }
                                position="left"
                            >
                                <Button
                                    data-testid={`send-email-button-${sequenceInfluencer.email}`}
                                    onClick={
                                        isMissingVariables ? () => setShowUpdateTemplateVariables(true) : handleStart
                                    }
                                    className={isMissingVariables ? '!border-gray-300 !bg-gray-300 !text-gray-500' : ''}
                                >
                                    <SendOutline className="mx-2 h-5 text-white" />
                                </Button>
                            </Tooltip>
                            <Button
                                data-testid="show-all-email-previews-button"
                                className="ml-2"
                                variant="ghost"
                                onClick={() => setShowEmailPreview(sequenceSteps)}
                            >
                                <Brackets className="h-5 w-5" />
                            </Button>
                            <button
                                className="min-w-max"
                                onClick={() => deleteSequenceInfluencer(sequenceInfluencer.id)}
                                data-testid="delete-influencer-button"
                            >
                                <DeleteOutline className="ml-6 h-5 w-5 text-gray-300" />
                            </button>
                        </td>
                    </>
                )}
                {currentTab === 'In Sequence' && (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 align-middle font-semibold text-gray-600">
                            {currentStep?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 align-middle">
                            <p
                                className={`flex w-fit select-none flex-row items-center justify-center gap-2 rounded-lg px-3 py-2 text-center ${
                                    EMAIL_STATUS_STYLES[getStatus(sequenceEmail) || 'Default'].style
                                }`}
                            >
                                <Icons status={getStatus(sequenceEmail)} />
                                {getStatus(sequenceEmail)}
                            </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {sequenceEmail?.email_send_at &&
                                new Date(sequenceEmail?.email_send_at).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </td>
                        <td className="px-6 py-4 align-middle">
                            <div className="flex">
                                <button
                                    className="text-primary-600"
                                    onClick={() =>
                                        setShowEmailPreview(
                                            sequenceSteps.filter(
                                                (step) => sequenceInfluencer?.sequence_step === step.step_number,
                                            ) || null,
                                        )
                                    }
                                >
                                    {sequenceSteps.find(
                                        (step) => sequenceInfluencer?.sequence_step === step.step_number,
                                    )?.name ?? '-'}
                                </button>
                                <button onClick={() => deleteSequenceInfluencer(sequenceInfluencer.id)}>
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
                            {sequenceEmail?.email_send_at &&
                                new Date(sequenceEmail?.email_send_at).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4`}>
                            <p
                                className={`flex w-fit select-none flex-row items-center justify-center gap-2 rounded-lg px-3 py-2 text-center ${
                                    EMAIL_STATUS_STYLES[getStatus(sequenceEmail) || 'Default'].style
                                }`}
                            >
                                <Icons status={getStatus(sequenceEmail)} />
                                {getStatus(sequenceEmail)}
                            </p>
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
