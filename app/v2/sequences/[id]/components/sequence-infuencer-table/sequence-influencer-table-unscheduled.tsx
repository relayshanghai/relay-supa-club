import TablePagination from "app/components/table-pagination/table-pagination";
import { useTranslation } from "react-i18next";
import { type SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";

export interface SequenceInfluencerTableUnscheduledProps {
    items: SequenceInfluencerEntity[];
    loading?: boolean;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
}
export default function SequenceInfluencerTableUnscheduled({
    items,
    loading,
    page,
    totalPages,
    size,
    onPageChange,
}: SequenceInfluencerTableUnscheduledProps) {
    const { t } = useTranslation()
    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    {t(`campaigns.title`)}
                </th>
                <th scope="col" className="px-6 py-3">
                    {t(`manager.manager`) }
                </th>
                <th scope="col" className="px-6 py-3">
                    {t(`campaigns.show.productName`) }
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
            {
            // items.map(influencer => (
            //     <tr key={influencer.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
            //         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            //             <Link href={`/v2/influencers/${influencer.id}`} >{influencer.name}</Link>
            //         </th>
            //         <td className="px-6 py-4">
            //             {influencer.manager?.firstName || influencer.managerFirstName || '-'}
            //         </td>
            //         <td className="px-6 py-4">
            //             {influencer.product?.name || '-'}
            //         </td>
            //         <td className="px-6 py-4">
            //             { influencer.createdAt.toString() }
            //         </td>
            //         <td className="px-6 py-4">
            //             { influencer.numOfInfluencers }
            //         </td>
            //         <td className="px-6 py-4">
            //             {/* to do action edit */}
            //         </td>
            //     </tr>
            // ))
            }
        
            </tbody>
        </table>
        <TablePagination page={page} size={size} totalPages={totalPages} onPageChange={onPageChange}/>
    </div>
}