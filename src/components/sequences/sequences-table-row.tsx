import Link from 'next/link';
import type { GetSequenceResponse } from 'pages/api/sequence/[id]';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { Sequence } from 'src/utils/api/db';
import { decimalToPercent } from 'src/utils/formatter';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
import { DeleteOutline } from '../icons';
import { DeleteSequenceModal } from '../modal-delete-sequence';

const useGetSequence = (id: string) => {
    return useSWR(`/api/sequence/${id}`, async (url: string) => {
        const sequence = await apiFetch<GetSequenceResponse>(url, {});
        return sequence.content;
    });
}

export const SequencesTableRow = ({ sequence }: { sequence: Sequence }) => {
    const { t } = useTranslation();
    const { sequenceEmails } = useSequenceEmails(sequence.id);
    const { data: currentSequence, mutate: refreshCurrentSequence } = useGetSequence(sequence.id)
    const { templateVariables } = useTemplateVariables(sequence.id);
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
            toast.success(t('sequences.deleteSuccess'));
        } catch (error) {
            toast.error(t('sequences.deleteFail'));
            clientLogger(error, 'error');
        }
        refreshCurrentSequence()
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
            <DeleteSequenceModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleDelete={handleDeleteSequence}
                name={sequence.name}
            />
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="whitespace-nowrap px-6 py-3 text-primary-600">
                    <Link href={`/sequences/${sequence.id}`}>{sequence.name}</Link>
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{currentSequence?.total_influencers ?? 0}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{openRate}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{sequence.manager_first_name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                    {templateVariables?.find((variable) => variable.key === 'productName')?.value ?? '--'}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="align-middle"
                        data-testid={`delete-sequence:${sequence.name}`}
                    >
                        <DeleteOutline className="h-5 w-5 text-gray-300 hover:text-primary-500" />
                    </button>
                </td>
            </tr>
        </>
    );
};
