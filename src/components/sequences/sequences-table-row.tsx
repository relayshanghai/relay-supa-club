import Link from 'next/link';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence } from 'src/utils/api/db';
import { useMemo, useState } from 'react';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSequence } from 'src/utils/analytics/events/outreach/sequence-open';
import { Button } from '../button';
import { Edit } from '../icons';
import { CreateSequenceModal } from './create-sequence-modal';
import { useTranslation } from 'react-i18next';

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
    const { sequenceInfluencers } = useSequenceInfluencers([sequence.id]);
    const { track } = useRudderstackTrack();

    const handleChange = () => {
        onCheckboxChange(sequence.id);
    };
    const [showSequenceModal, setShowSequenceModal] = useState<boolean>(false);

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
            <CreateSequenceModal
                title={t('sequences.campaignModalEdit') as string}
                showCreateSequenceModal={showSequenceModal}
                setShowCreateSequenceModal={setShowSequenceModal}
                selectedSequence={sequence}
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
                <td className="flex items-center gap-2 whitespace-nowrap px-6 py-3 text-gray-700">
                    <Button
                        className="flex flex-row gap-2"
                        variant="ghost"
                        onClick={() => {
                            setShowSequenceModal(true);
                        }}
                    >
                        <Edit className="h-4 w-4 stroke-white" />
                    </Button>
                </td>
            </tr>
        </>
    );
};
