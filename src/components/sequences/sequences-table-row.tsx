import Link from 'next/link';
import { useEffect } from 'react';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence, SequenceEmail } from 'src/utils/api/db';
import { decimalToPercent } from 'src/utils/formatter';
import { DeleteOutline } from '../icons';

export const SequencesTableRow = ({
    sequence,
    setAllEmails,
}: {
    sequence: Sequence;
    setAllEmails: React.Dispatch<React.SetStateAction<SequenceEmail[]>>;
}) => {
    const { sequenceEmails } = useSequenceEmails(sequence.id);
    const { sequenceInfluencers } = useSequenceInfluencers(sequence.id);

    const openRate = decimalToPercent(
        (sequenceEmails?.filter(
            (email) => email.email_tracking_status === 'Link Clicked' || email.email_tracking_status === 'Opened',
        ).length || 0) / (sequenceEmails?.length || 0),
        1,
    );

    const deleteSequence = () => {
        //TODO: delete sequence call
    };

    useEffect(() => {
        if (!sequenceEmails) {
            return;
        }
        setAllEmails((prev) => [...prev, ...sequenceEmails]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                    <button onClick={deleteSequence} className="align-middle">
                        <DeleteOutline className="h-5 w-5 text-gray-300 hover:text-primary-500" />
                    </button>
                </td>
            </tr>
        </>
    );
};
