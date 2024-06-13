import Link from 'next/link';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence, SequenceStep } from 'src/utils/api/db';
import { decimalToPercent } from 'src/utils/formatter';
import { Brackets } from '../icons';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Button } from '../button';
import { EmailPreviewModal } from './email-preview-modal';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSequence } from 'src/utils/analytics/events/outreach/sequence-open';
import { useSequenceSteps } from 'src/hooks/use-sequence-steps';

export const SequencesTableRow = ({
    sequence,
    onCheckboxChange,
    checked,
}: {
    sequence: Sequence;
    onCheckboxChange: (id: string) => void;
    checked: boolean;
}) => {
    const { t } = useTranslation();
    const { sequenceSteps } = useSequenceSteps(sequence.id);
    const { templateVariables } = useTemplateVariables(sequence.id);
    const { sequenceEmails } = useSequenceEmails(sequence.id);
    const { sequenceInfluencers } = useSequenceInfluencers([sequence.id]);
    const openRate = decimalToPercent(
        (sequenceEmails?.filter(
            (email) => email.email_tracking_status === 'Link Clicked' || email.email_tracking_status === 'Opened',
        ).length || 0) / (sequenceEmails?.length || 1),
        0,
    );
    const { track } = useRudderstackTrack();

    const handleChange = () => {
        onCheckboxChange(sequence.id);
    };
    const [showEmailPreview, setShowEmailPreview] = useState<SequenceStep[] | null>(null);

    const influencer = useMemo(
        () =>
            sequenceInfluencers?.filter(
                (influencer) =>
                    influencer.funnel_status === 'To Contact' ||
                    influencer.funnel_status === 'In Sequence' ||
                    influencer.funnel_status === 'Ignored',
            ),
        [sequenceInfluencers],
    );

    return (
        <>
            <EmailPreviewModal
                visible={!!showEmailPreview}
                onClose={() => setShowEmailPreview(null)}
                sequenceSteps={showEmailPreview || []}
                templateVariables={templateVariables ?? []}
            />
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="display-none items-center whitespace-nowrap text-center align-middle">
                    <input
                        data-testid="sequence-checkbox"
                        className="select-none appearance-none rounded-sm border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                        checked={checked}
                        onChange={handleChange}
                        type="checkbox"
                    />
                </td>
                <td
                    className="whitespace-nowrap px-6 py-3 text-primary-600"
                    onClick={() => {
                        track(OpenSequence, {
                            sequence_id: sequence.id,
                            total_influencers: influencer?.length || 0,
                            $add: { sequence_open_count: 1 },
                        });
                    }}
                >
                    <Link href={`/sequences/${encodeURIComponent(sequence.id)}`}>{sequence.name}</Link>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{influencer?.length || 0}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{openRate}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{sequence.manager_first_name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                    {templateVariables?.find((variable) => variable.key === 'productName')?.value ?? '--'}
                </td>
                <td className="flex items-center gap-2 whitespace-nowrap px-6 py-3 text-gray-700">
                    <Button
                        className="flex flex-row gap-2"
                        variant="ghost"
                        onClick={() => setShowEmailPreview(sequenceSteps ?? [])}
                    >
                        <Brackets className="h-5 w-5" />
                        {t('sequences.updateTemplateVariables')}
                    </Button>
                </td>
            </tr>
        </>
    );
};
