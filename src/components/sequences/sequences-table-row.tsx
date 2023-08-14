import Link from 'next/link';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence } from 'src/utils/api/db';
import { decimalToPercent } from 'src/utils/formatter';
import { DeleteOutline } from '../icons';
import { toast } from 'react-hot-toast';
import { useSequence } from 'src/hooks/use-sequence';
import { clientLogger } from 'src/utils/logger-client';

export const SequencesTableRow = ({ sequence }: { sequence: Sequence }) => {
    const { sequenceEmails } = useSequenceEmails(sequence.id);
    const { sequenceInfluencers, refreshSequenceInfluencers } = useSequenceInfluencers(
        '0b59d853-fb7f-4a41-ad2b-dc090f61dd27',
    );
    const { deleteSequence } = useSequence();
    const openRate = decimalToPercent(
        (sequenceEmails?.filter(
            (email) => email.email_tracking_status === 'Link Clicked' || email.email_tracking_status === 'Opened',
        ).length || 0) / (sequenceEmails?.length || 1),
        0,
    );
    const handleDeleteSequence = async () => {
        try {
            await deleteSequence(sequence.id);
            toast.success('Sequence deleted successfully');
        } catch (error) {
            clientLogger(error, 'error');
        }
        refreshSequenceInfluencers();
    };

    // TODO: add manager name
    // TODO: get product name from template variable?

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
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                    <button onClick={handleDeleteSequence} className="align-middle">
                        <DeleteOutline className="h-5 w-5 text-gray-300 hover:text-primary-500" />
                    </button>
                </td>
            </tr>
        </>
    );
};
