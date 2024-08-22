'use client';
import { Button } from 'app/components/buttons';
import { Edit, Spinner } from 'app/components/icons';
import TablePagination from 'app/components/table-pagination/table-pagination';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { CampaignWizardModal } from '../modals/campaign-wizard-modal';
import { useState } from 'react';
import { useSequence } from 'src/hooks/v2/use-sequences';

export interface SequenceTableProps {
    loading?: boolean;
    items: SequenceEntity[];
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
}
export default function SequenceTable({
    items,
    page,
    loading,
    totalPages,
    size,
    onPageChange,
}: Readonly<SequenceTableProps>) {
    const { t } = useTranslation();
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
    const { setEditMode, setSequence } = useSequence();
    return (
        <>
            <CampaignWizardModal
                showCreateCampaignModal={showCreateCampaignModal}
                setShowCreateCampaignModal={setShowCreateCampaignModal}
            />
            <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
                <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t(`campaigns.title`)}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t(`manager.manager`)}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t(`campaigns.show.productName`)}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t(`campaigns.createdAt`)}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t(`campaigns.show.numInfluencers`)}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t(`campaigns.settings`)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((sequence) => (
                            <tr
                                key={sequence.id}
                                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                            >
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                >
                                    <Link href={`/v2/sequences/${sequence.id}`}>{sequence.name}</Link>
                                </th>
                                <td className="px-6 py-4">
                                    {sequence.manager?.firstName ?? sequence.managerFirstName ?? '-'}
                                </td>
                                <td className="px-6 py-4">{sequence.product?.name ?? '-'}</td>
                                <td className="px-6 py-4">{sequence.createdAt.toString()}</td>
                                <td className="px-6 py-4">{sequence.numOfInfluencers}</td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="flex gap-2"
                                        onClick={() => {
                                            setShowCreateCampaignModal(true);
                                            setSequence({ ...sequence, id: sequence.id });
                                            setEditMode(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 stroke-white" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="flex w-full justify-center">
                        <Spinner className="my-4 flex h-8 w-8 fill-primary-600 text-white" />
                    </div>
                )}
                <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </>
    );
}
