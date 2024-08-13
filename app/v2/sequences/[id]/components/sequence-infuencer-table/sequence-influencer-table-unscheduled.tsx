import TablePagination from 'app/components/table-pagination/table-pagination';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerTableName from './sequence-influencer-table-name';
import SequenceInfluencerTableEmail from './sequence-influencer-table-email';
import { SequenceInfluencerScheduleStatus } from 'types/v2/sequence-influencer';
import dateFormat from 'src/utils/dateFormat';

export interface SequenceInfluencerTableUnscheduledProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
}
export default function SequenceInfluencerTableUnscheduled({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
    sequenceId,
}: SequenceInfluencerTableUnscheduledProps) {
    const { t } = useTranslation();
    return (
        <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {
                                // to do add checkbox
                            }
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.name`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.viewCard`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.influencerEmail`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.influencerNiches`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.dateAdded`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.unscheduled.action`)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((influencer, index) => (
                        <tr
                            key={influencer.id}
                            className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                        >
                            <th
                                scope="row"
                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                            >
                                {
                                    // to do add checkbox
                                }
                            </th>
                            <td className="px-6 py-4">
                                <SequenceInfluencerTableName influencer={influencer} />
                            </td>
                            <td className="px-6 py-4" />
                            <td className="px-6 py-4">
                                {(influencer.email ||
                                    influencer.scheduleStatus === SequenceInfluencerScheduleStatus.PENDING) && (
                                    <SequenceInfluencerTableEmail
                                        sequenceId={sequenceId}
                                        index={index}
                                        influencer={influencer}
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4" />
                            <td className="px-6 py-4">
                                {
                                    //@ts-ignore TODO: remove this insane hacky library and use standard browser API
                                    dateFormat(influencer.createdAt)
                                }
                            </td>
                            <td className="px-6 py-4">{/* to do action edit */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}
