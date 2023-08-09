import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { Sequence } from 'src/utils/api/db';
import { sequencesIndexColumns } from './constants';

const SequencesTable = ({ sequences }: { sequences: Sequence[] | undefined }) => {
    const { t } = useTranslation();

    return (
        <table className="border-collapse border border-gray-300">
            <thead>
                <tr className="border-b-2 border-gray-200">
                    {sequencesIndexColumns.map((column) => (
                        <th
                            key={column}
                            className="whitespace-nowrap bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500"
                        >
                            {t(`sequences.indexColumns.${column}`)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sequences?.map((sequence) => {
                    return (
                        <tr key={sequence.id} className="border-b-2 border-gray-200">
                            <td className="whitespace-nowrap px-6 py-3 text-primary-600">
                                <Link href={`/sequences/${sequence.id}`}>{sequence.name}</Link>
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-700">influencers number</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-700">12%</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-700">Mikaela</td>
                            <td className="whitespace-nowrap px-6 py-3 text-gray-700">W3</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SequencesTable;
