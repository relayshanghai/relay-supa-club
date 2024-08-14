import TablePagination from 'app/components/table-pagination/table-pagination';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerTableName from './sequence-influencer-table-name';
import SequenceInfluencerTableEmail from './sequence-influencer-table-email';
import { SequenceInfluencerScheduleStatus } from 'types/v2/sequence-influencer';
import dateFormat from 'src/utils/dateFormat';
import { useCallback, useEffect, useState } from 'react';

export interface SequenceInfluencerTableUnscheduledProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    sequenceId: string;
    setSelectedInfluencers?: (influencers: SequenceInfluencerEntity[]) => void;
    selectedInfluencers?: SequenceInfluencerEntity[];
}
export default function SequenceInfluencerTableUnscheduled({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
    sequenceId,
    setSelectedInfluencers,
    selectedInfluencers = [],
}: SequenceInfluencerTableUnscheduledProps) {
    const { t } = useTranslation();
    const [selectAll, setSelectAll] = useState(false);

    const influencerOnTheList = useCallback(() => {
        if (selectedInfluencers.length === 0) return false;
        return items.every((influencer) => selectedInfluencers.some((i) => i.id === influencer.id));
    }, [selectedInfluencers, items]);

    useEffect(() => {
        if (influencerOnTheList()) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [page, influencerOnTheList]);

    const selectAllHandler = () => {
        setSelectAll(!selectAll);
        if (!selectedInfluencers) return;
        if (selectAll) {
            setSelectedInfluencers &&
                setSelectedInfluencers(
                    selectedInfluencers.filter((i) => !items.some((influencer) => influencer.id === i.id)),
                );
        } else {
            setSelectedInfluencers &&
                setSelectedInfluencers([...selectedInfluencers, ...items.filter((i) => !isSelected(i.id))]);
        }
    };

    const isSelected = (id: string) => {
        if (!selectedInfluencers) return false;
        return selectedInfluencers.some((influencer) => influencer.id === id);
    };

    const handleSelectedInfluencers = (influencer: SequenceInfluencerEntity[]) => {
        influencer.forEach((influencer) => {
            if (!isSelected(influencer.id)) {
                setSelectedInfluencers && setSelectedInfluencers([...selectedInfluencers, influencer]);
                if (influencerOnTheList()) setSelectAll(true);
            } else {
                setSelectedInfluencers &&
                    setSelectedInfluencers(selectedInfluencers.filter((i) => i.id !== influencer.id));
                setSelectAll(false);
            }
        });
    };

    return (
        <div className={`relative w-full overflow-x-auto shadow-md sm:rounded-lg  ${loading && 'animate-pulse'}`}>
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <input
                                data-testid="sequence-influencers-select-all"
                                className="display-none appearance-none rounded border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                                type="checkbox"
                                checked={selectAll}
                                onChange={() => selectAllHandler()}
                            />
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
                                <input
                                    data-testid="influencer-checkbox"
                                    className="select-none appearance-none rounded-sm border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                                    checked={isSelected(influencer.id)}
                                    onChange={() => handleSelectedInfluencers([influencer])}
                                    type="checkbox"
                                />
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
