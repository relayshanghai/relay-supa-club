import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'shadcn/components/ui/checkbox';
import { useSequences } from 'src/hooks/v2/use-sequences';


export default function ThreadListFilterSequence({
    selectedSequenceIds,
    onChange,
}: {
    selectedSequenceIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const { t } = useTranslation();
    const {
        sequences,
        loading
    } = useSequences()
    const handleUpdateFunnelStatus = useCallback(
        (checkSequence: string) => {
            if (!checkSequence) {
                onChange([]);
                return;
            }
            if (selectedSequenceIds.length === 0) {
                onChange([checkSequence]);
            } else {
                if (selectedSequenceIds.some((selectedSequenceId) => selectedSequenceId === checkSequence)) {
                    onChange(selectedSequenceIds.filter((s) => s !== checkSequence));
                } else {
                    onChange([...selectedSequenceIds, checkSequence]);
                }
            }
        },
        [selectedSequenceIds, onChange],
    );

    return (
        <div className="flex flex-col gap-2">
            <p className="pb-2 text-xs font-medium text-gray-400">{t('inbox.filters.bySequence')}</p>
            {
                loading && <div>Loading...</div>
            }
            {sequences.map((sequence, index) => (
                <div
                    key={sequence.id}
                    onClick={(e) => {
                        if ((e.target as HTMLInputElement).type !== 'checkbox') {
                            const checkbox = e.currentTarget.querySelector(
                                'input[type="checkbox"]',
                            ) as HTMLInputElement;
                            checkbox && checkbox.click();
                        }
                    }}
                >
                    <label
                        className={`flex items-center gap-2 py-2 ${index % 2 === 0 ? 'bg-gray-50' : ''} cursor-pointer`}
                    >
                        <Checkbox
                            className="border-gray-300"
                            checked={selectedSequenceIds.some((selectedSequenceId) => selectedSequenceId === sequence.id)}
                            onCheckedChange={() => {
                                handleUpdateFunnelStatus(sequence.id);
                            }}
                        />
                        <span className="flex items-center gap-2 rounded px-2 py-1 text-sm">{sequence.name}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};
