import { useTranslation } from 'react-i18next';
import type { Sequence } from 'src/utils/api/db';
import { sequencesIndexColumns } from './constants';
import { SequencesTableRow } from './outreaches-table-row';
import { useCallback } from 'react';

const SequencesTable = ({
    sequences,
    selection,
    setSelection,
}: {
    sequences: Sequence[] | undefined;
    selection: string[];
    setSelection: (selection: string[]) => void;
}) => {
    const { t } = useTranslation();
    const handleCheckboxChange = useCallback(
        (id: string) => {
            if (selection.includes(id)) {
                setSelection(selection.filter((selectedId) => selectedId !== id));
                return;
            }
            setSelection([...selection, id]);
        },
        [selection, setSelection],
    );
    const handleCheckAll = useCallback(() => {
        if (!sequences) return;
        if (selection.length === sequences.length) {
            setSelection([]);
            return;
        }
        setSelection(sequences.map((influencer) => influencer.id));
    }, [selection, sequences, setSelection]);
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="bg-white px-4">
                            <input
                                data-testid="sequences-select-all"
                                className="display-none appearance-none rounded border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                                type="checkbox"
                                checked={sequences?.length === selection.length && selection.length > 0}
                                onChange={handleCheckAll}
                            />
                        </th>
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
                    {sequences?.map((sequence) => (
                        <SequencesTableRow
                            key={sequence.id}
                            sequence={sequence}
                            checked={selection.includes(sequence.id)}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SequencesTable;
