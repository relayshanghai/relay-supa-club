import { useTranslation } from 'react-i18next';
import type { Sequence } from 'src/utils/api/db';
import { sequencesIndexColumns } from './constants';
import { SequencesTableRow } from './sequences-table-row';

const SequencesTable = ({ sequences }: { sequences: Sequence[] | undefined }) => {
    const { t } = useTranslation();
    const sequencesWithoutDeleted = sequences?.filter((sequence) => !sequence.deleted);
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
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
                    {sequencesWithoutDeleted?.map((sequence) => {
                        return <SequencesTableRow key={sequence.id} sequence={sequence} />;
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SequencesTable;
