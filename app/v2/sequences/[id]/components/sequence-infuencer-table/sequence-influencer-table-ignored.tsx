import TablePagination from 'app/components/table-pagination/table-pagination';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerTableName from './sequence-influencer-table-name';
import { getCurrentSequenceStepInfo } from 'app/utils/sequences';
import { Spinner } from 'app/components/icons';

export interface SequenceInfluencerTableIgnoredProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
}
export default function SequenceInfluencerTableIgnored({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
}: SequenceInfluencerTableIgnoredProps) {
    const { t } = useTranslation();

    return (
        <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.ignored.name`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.ignored.firstEmailSentAt`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.ignored.lastEmailSentAt`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.ignored.action`)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((influencer) => {
                        const { sequenceEmailSorted } = getCurrentSequenceStepInfo(influencer);
                        return (
                            <tr
                                key={influencer.id}
                                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                            >
                                <td className="px-6 py-4">
                                    <SequenceInfluencerTableName influencer={influencer} />
                                </td>
                                <td className="px-6 py-4">
                                    {sequenceEmailSorted && sequenceEmailSorted[0]?.emailSendAt
                                        ? sequenceEmailSorted[0]?.emailSendAt.toString()
                                        : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {sequenceEmailSorted &&
                                    sequenceEmailSorted[sequenceEmailSorted.length - 1]?.emailSendAt
                                        ? sequenceEmailSorted[sequenceEmailSorted.length - 1]?.emailSendAt?.toString()
                                        : '-'}
                                </td>
                                <td className="px-6 py-4" />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {loading && (
                <div className="flex w-full justify-center">
                    <Spinner className="my-4 flex h-8 w-8 fill-primary-600 text-white" />
                </div>
            )}
            <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}
