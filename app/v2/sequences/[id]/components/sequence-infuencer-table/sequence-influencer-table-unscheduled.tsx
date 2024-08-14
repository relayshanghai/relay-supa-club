import TablePagination from "app/components/table-pagination/table-pagination";
import { useTranslation } from "react-i18next";
import { type SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import { AvatarWithFallback } from "../avatar/avatar-with-fallback";
import SequenceInfluencerTableName from "./sequence-influencer-table-name";
import { TableInlineInput } from "src/components/library";
import SequenceInfluencerTableEmail from "./sequence-influencer-table-email";
import { SequenceInfluencerScheduleStatus } from "types/v2/sequence-influencer";
import dateFormat from "src/utils/dateFormat";

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
    sequenceId
}: SequenceInfluencerTableUnscheduledProps) {
    const { t } = useTranslation()
    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3" >
                    {
                        // to do add checkbox
                    }
                </th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.name`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.viewCard`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.influencerEmail`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.influencerNiches`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.dateAdded`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.unscheduled.action`)}</th>
            </tr>
        </thead>
        <tbody>
            {
            items.map((influencer, index) => (
                <tr key={influencer.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {
                            // to do add checkbox
                        }
                    </th>
                    <td className="px-6 py-4">
                        <SequenceInfluencerTableName influencer={influencer} />
                    </td>
                    <td className="px-6 py-4">
                    </td>
                    <td className="px-6 py-4">
                        {
                            (influencer.email || influencer.scheduleStatus === SequenceInfluencerScheduleStatus.PENDING) && 
                            <SequenceInfluencerTableEmail sequenceId={sequenceId} index={index} influencer={influencer} />
                        }
                    </td>
                    <td className="px-6 py-4">
                        {
                            influencer.tags.map(tag => (
                                <div key={tag} className="h-7 m-1 px-2 py-1 bg-[#fefefe] rounded-md border border-[#ed46bb] justify-end items-center gap-2.5 inline-flex">
                                    <div className="text-center text-violet-600 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">{tag}</div>
                                </div>
                            ))
                        }
                    </td>
                    <td className="px-6 py-4">
                        {
                            //@ts-ignore TODO: remove this insane hacky library and use standard browser API
                            dateFormat(influencer.createdAt)
                        }
                    </td>
                    <td className="px-6 py-4">
                        {/* to do action edit */}
                    </td>
                </tr>
            ))
            }
        
            </tbody>
        </table>
        <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange}/>
    </div>
}