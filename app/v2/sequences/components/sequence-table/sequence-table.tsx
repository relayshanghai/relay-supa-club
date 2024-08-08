'use client'
import TablePagination from "app/components/table-pagination/table-pagination";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { type SequenceEntity } from "src/backend/database/sequence/sequence-entity";

export interface SequenceTableProps {
    loading?: boolean;
    items: SequenceEntity[];
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
}
export default function SequenceTable({
    items, page, loading, totalPages, size, onPageChange
}: SequenceTableProps) {
    const { t } = useTranslation()
    return <div className={`relative overflow-x-auto shadow-md sm:rounded-lg w-full  ${loading && 'animate-pulse'}`}>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
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
            items.map(sequence => (
                <tr key={sequence.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <Link href={`/v2/sequences/${sequence.id}`} >{sequence.name}</Link>
                    </th>
                    <td className="px-6 py-4">
                        {sequence.manager?.firstName || sequence.managerFirstName || '-'}
                    </td>
                    <td className="px-6 py-4">
                        {sequence.product?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                        { sequence.createdAt.toString() }
                    </td>
                    <td className="px-6 py-4">
                        { sequence.numOfInfluencers }
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