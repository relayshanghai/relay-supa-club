import TablePagination from "app/components/table-pagination/table-pagination";
import { useTranslation } from "react-i18next";
import { type SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import SequenceInfluencerTableName from "./sequence-influencer-table-name";
import { getCurrentSequenceStepInfo } from "app/utils/sequences";

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

    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.ignored.name`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.ignored.firstEmailSentAt`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.ignored.lastEmailSentAt`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.ignored.action`)}</th>
            </tr>
        </thead>
        <tbody>
            {
                items.map((influencer) => {
                    const { sequenceEmailSorted } = getCurrentSequenceStepInfo(influencer)
                return <tr key={influencer.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    
                    <td className="px-6 py-4">
                        <SequenceInfluencerTableName influencer={influencer} />
                    </td>
                    <td className="px-6 py-4">
                        {
                            sequenceEmailSorted && sequenceEmailSorted[0]?.emailSendAt ? sequenceEmailSorted[0]?.emailSendAt.toString() : '-'
                        }
                    </td>
                    <td className="px-6 py-4">
                        {
                            sequenceEmailSorted && sequenceEmailSorted[sequenceEmailSorted.length - 1]?.emailSendAt ? sequenceEmailSorted[sequenceEmailSorted.length - 1]?.emailSendAt?.toString() : '-'
                        }
                    </td>
                    <td className="px-6 py-4">
                    </td>
                </tr>
                })
            }
        
            </tbody>
        </table>
        <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange}/>
    </div>
}