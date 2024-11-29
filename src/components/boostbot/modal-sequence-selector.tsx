import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Modal } from 'src/components/modal';
import { useSequences } from 'src/hooks/use-sequences';
import type { Sequence } from 'src/utils/api/db';

export const ModalSequenceSelector = ({
    show,
    setShow,
    handleAddToSequence,
    sequences,
    sequence,
    setSequence,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    sequence?: Sequence | null;
    setSequence: (sequence: Sequence | undefined) => void;
    sequences: Sequence[];
    handleAddToSequence: () => void;
}) => {
    const { refreshSequences } = useSequences();
    useEffect(() => {
        if (show) {
            refreshSequences();
        }
    }, [show, refreshSequences]);

    const { t } = useTranslation();
    const handleSelectChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (!sequences) {
                return;
            }
            const selectedSequenceObject = sequences.find((sequence) => sequence.name.trim() === e.target.value.trim());
            setSequence(selectedSequenceObject);
        },
        [sequences, setSequence],
    );
    return (
        <Modal
            title={t('boostbot.modal.addToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <div className="space-y-4 p-6">
                <div>
                    <div className="mb-2 font-semibold text-gray-800">{t('creators.campaign')}</div>
                    <select
                        data-testid="sequence-dropdown"
                        onChange={(e) => handleSelectChange(e)}
                        value={sequence?.name}
                        className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none focus:border-primary-500 focus:ring-primary-500"
                    >
                        {(!sequences || sequences.length === 0) && <option>{t('creators.noCampaign')}</option>}
                        {sequences?.map((sequence) => (
                            <option key={sequence.id}>{sequence.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 p-6">
                <Button variant="secondary" onClick={() => setShow(false)}>
                    {t('creators.cancel')}
                </Button>

                <Button
                    disabled={!sequence?.id}
                    onClick={() => {
                        handleAddToSequence();
                        setShow(false);
                    }}
                >
                    {t('boostbot.modal.addToCampaign')}
                </Button>
            </div>
        </Modal>
    );
};
