import TablePagination from "app/components/table-pagination/table-pagination";
import { useTranslation } from "react-i18next";
import { type SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import SequenceInfluencerTableName from "./sequence-influencer-table-name";
import { stepIcon } from "./sequence-influencer-table-scheduled";

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

    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.replied.name`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.replied.sequenceEmailRepliedTo`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.replied.firstRepliedAt`)}</th>
                <th scope="col" className="px-6 py-3" >{t(`sequences.table.replied.viewInbox`)}</th>
            </tr>
        </thead>
        <tbody>
            {
                items.map((influencer) => {
                    const replied = influencer.sequenceEmails?.find(email => email.emailDeliveryStatus === 'Replied')
                return <tr key={influencer.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    
                    <td className="px-6 py-4">
                        <SequenceInfluencerTableName influencer={influencer} />
                    </td>
                    <td className="px-6 py-4">
                        {
                            replied && 
                            <div className="h-[60px] px-4 py-2 justify-start items-center gap-2 inline-flex">
                                <div className="w-5 h-5 relative" >
                                    {stepIcon[replied?.sequenceStep?.stepNumber]}
                                </div>
                                <div className="text-gray-500 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t(`sequences.steps.${replied?.sequenceStep.name}`)}</div>
                            </div>
                        }
                    </td>
                    <td className="px-6 py-4">
                        {
                            replied && replied.updatedAt ? replied.updatedAt.toString() : '-'
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