import Link from 'next/link';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence, SequenceStep } from 'src/utils/api/db';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { useMemo, useState } from 'react';
import { EmailPreviewModal } from './email-preview-modal';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSequence } from 'src/utils/analytics/events/outreach/sequence-open';

export const SequencesTableRow = ({
    sequence,
    onCheckboxChange,
    checked,
}: {
    sequence: Sequence;
    onCheckboxChange: (id: string) => void;
    checked: boolean;
}) => {
    const { templateVariables } = useTemplateVariables(sequence.id);
    const { sequenceInfluencers } = useSequenceInfluencers([sequence.id]);
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
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{sequence.manager_first_name}</td>
            </tr>
        </>
    );
};
