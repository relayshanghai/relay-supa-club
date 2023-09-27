import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Info } from 'src/components/icons';
import { Modal } from 'src/components/modal';
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
    sequence: Sequence | null;
    setSequence: (sequence: Sequence | undefined) => void;
    sequences: Sequence[];
    handleAddToSequence: () => void;
}) => {
    const { t } = useTranslation();
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value);
        setSequence(selectedSequenceObject);
    };
    return (
        <Modal
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <div className="space-y-4 p-6">
                <div>
                    <div className="mb-2 font-semibold text-gray-800">{t('creators.sequence')}</div>
                    <select
                        data-testid="sequence-dropdown"
                        onChange={(e) => handleSelectChange(e)}
                        value={sequence?.name}
                        className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none focus:border-primary-500 focus:ring-primary-500"
                    >
                        {(!sequences || sequences.length === 0) && <option>{t('creators.noSequence')}</option>}
                        {sequences?.map((sequence) => (
                            <option key={sequence.id}>{sequence.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-start rounded-md bg-primary-50 p-4">
                    <Info className="mr-4 mt-1 h-6 w-6 flex-none text-primary-500" />
                    <div className="space-y-4 text-primary-500">
                        <p>{t('creators.addToSequenceNotes')}</p>
                        <p>{t('creators.addToSequenceNotes2')}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 p-6">
                <Button variant="secondary" onClick={() => setShow(false)}>
                    {t('creators.cancel')}
                </Button>

                <Button
                    onClick={() => {
                        handleAddToSequence();
                        setShow(false);
                    }}
                    type="submit"
                >
                    {t('creators.addToSequence')}
                </Button>
            </div>
        </Modal>
    );
};
