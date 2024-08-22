import TablePagination from 'app/components/table-pagination/table-pagination';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerTableName from './sequence-influencer-table-name';
import { stepIcon } from './sequence-influencer-table-scheduled';
import { Spinner } from 'app/components/icons';

export interface SequenceInfluencerTableRepliedProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
}
export default function SequenceInfluencerTableReplied({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
}: SequenceInfluencerTableRepliedProps) {
    const { t } = useTranslation();

    return (
        <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.replied.name`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.replied.sequenceEmailRepliedTo`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.replied.firstRepliedAt`)}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t(`sequences.table.replied.viewInbox`)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((influencer) => {
                        const replied = influencer.sequenceEmails?.find(
                            (email) => email.emailDeliveryStatus === 'Replied',
                        );
                        return (
                            <tr
                                key={influencer.id}
                                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                            >
                                <td className="px-6 py-4">
                                    <SequenceInfluencerTableName influencer={influencer} />
                                </td>
                                <td className="px-6 py-4">
                                    {replied && (
                                        <div className="inline-flex h-[60px] items-center justify-start gap-2 px-4 py-2">
                                            <div className="relative h-5 w-5">
                                                {stepIcon[replied?.sequenceStep?.stepNumber]}
                                            </div>
                                            <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-500">
                                                {t(`sequences.steps.${replied?.sequenceStep.name}`)}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {replied && replied.updatedAt ? replied.updatedAt.toString() : '-'}
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
