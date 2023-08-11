import { useTranslation } from 'react-i18next';
import type { Sequence, SequenceEmail } from 'src/utils/api/db';
import { sequencesIndexColumns } from './constants';
import { SequencesTableRow } from './sequences-table-row';

const SequencesTable = ({
    sequences,
    setAllEmails,
}: {
    sequences: Sequence[] | undefined;
    setAllEmails: React.Dispatch<React.SetStateAction<SequenceEmail[]>>;
}) => {
    const { t } = useTranslation();

    return (
        <table className="border-collapse">
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
                    return <SequencesTableRow key={sequence.id} sequence={sequence} setAllEmails={setAllEmails} />;
                })}
            </tbody>
        </table>
    );
};

export default SequencesTable;
