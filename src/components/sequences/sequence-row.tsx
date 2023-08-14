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
import { Brackets, DeleteOutline } from '../icons';
import { Tooltip } from '../library';
import { EmailPreviewModal } from './email-preview-modal';

interface SequenceRowProps {
    sequenceInfluencer: SequenceInfluencer;
    sequenceEmail?: SequenceEmail;
    sequenceSteps: SequenceStep[];
    currentTab: SequenceInfluencer['funnel_status'];
    missingVariables: string[];
    isMissingVariables: boolean;
    setShowUpdateTemplateVariables: (value: SetStateAction<boolean>) => void;
    templateVariables: TemplateVariable[];
}

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
}) => {
    const { influencerSocialProfile } = useInfluencerSocialProfile(sequenceInfluencer.influencer_social_profile_id);
    const { updateSequenceInfluencer, deleteSequenceInfluencer } = useSequenceInfluencers(
        sequenceInfluencer?.sequence_id,
    );
    const { i18n } = useTranslation();
    const [email, setEmail] = useState(sequenceInfluencer.email ?? '');
    const [showEmailPreview, setShowEmailPreview] = useState(false);

    const handleEmailUpdate = async (email: string) => {
        const updatedSequenceInfluencer = await updateSequenceInfluencer({ id: sequenceInfluencer.id, email });
        setEmail(updatedSequenceInfluencer.email ?? '');
    };
    const currentStep = sequenceSteps?.find((step) => step.step_number === sequenceInfluencer.sequence_step);
    const { t } = useTranslation();

    const handleStart = async () => {
        // TODO
    };
    return (
        <>
            <EmailPreviewModal
                visible={showEmailPreview}
                onClose={() => setShowEmailPreview(false)}
                sequenceSteps={sequenceSteps}
                templateVariables={templateVariables}
            />
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="whitespace-nowrap px-6 py-2">
                    <div className="flex flex-row items-center gap-2">
                        <div>
                            <img
                                className="inline-block h-14 w-14 bg-slate-300"
                                src={imgProxy(influencerSocialProfile?.avatar_url ?? '')}
                                alt={`influencer-avatar-${influencerSocialProfile?.name}`}
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="font-semibold text-primary-600">{influencerSocialProfile?.name}</p>
                            <Link
                                className="cursor-pointer font-semibold text-gray-500"
                                href={influencerSocialProfile?.url ?? ''}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                @{influencerSocialProfile?.username}
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
                                    Send
                                </Button>
                            </Tooltip>
                            <Button className="ml-2" variant="ghost" onClick={() => setShowEmailPreview(true)}>
                                <Brackets />
                            </Button>
                            <button
                                className="min-w-max"
                                onClick={() => deleteSequenceInfluencer(sequenceInfluencer.id)}
                                data-testid="delete-influencer-button"
                            >
                                <DeleteOutline className="ml-6 h-6 w-6 text-gray-300" />
                            </button>
                        </td>
                    </>
                )}
                {currentTab === 'In Sequence' && (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-600">{currentStep?.name}</td>
                        {/* TODO: add colors and icons for each status */}
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">{getStatus(sequenceEmail)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {sequenceEmail?.email_send_at &&
                                new Date(sequenceEmail?.email_send_at).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {/* TODO */}
                            <Button>Preview email</Button>
                            <button className="ml-3" onClick={() => deleteSequenceInfluencer(sequenceInfluencer.id)}>
                                <DeleteOutline
                                    data-testid="delete-influencer-button"
                                    className="h-6 w-6 text-gray-300"
                                />
                            </button>
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
                        {/* TODO: add colors and icons for each status */}
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">{getStatus(sequenceEmail)}</td>
                        <td className=" whitespace-nowrap px-6 py-4 text-gray-600">
                            {/* TODO */}
                            <Button>Restart</Button>
                        </td>
                    </>
                )}
            </tr>
        </>
    );
};

export default SequenceRow;
