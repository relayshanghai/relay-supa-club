import Link from 'next/link';
import { useMemo } from 'react';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence } from 'src/utils/api/db';
import { decimalToPercent } from 'src/utils/formatter';

export const SequencesTableRow = ({ sequence }: { sequence: Sequence }) => {
    const { sequenceEmails } = useSequenceEmails(sequence.id);
    const { sequenceInfluencers } = useSequenceInfluencers([sequence.id]);

    const openRate = useMemo(() => {
        return decimalToPercent(
            (sequenceEmails?.filter(
                (email) => email.email_tracking_status === 'Link Clicked' || email.email_tracking_status === 'Opened',
            ).length || 0) / (sequenceEmails?.length || 1),
            1,
        );
    }, [sequenceEmails]);

    // TODO: add manager name
    // TODO: get product name from template variable ?

    return (
        <>
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="whitespace-nowrap px-6 py-3 text-primary-600">
                    <Link href={`/sequences/${sequence.id}`}>{sequence.name}</Link>
                </td>

                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{sequenceInfluencers?.length || 0}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{openRate}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">Mikaela</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">W3</td>
            </tr>
        </>
    );
};
