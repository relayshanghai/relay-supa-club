import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import { Button } from '../button';
import { Spinner } from '../icons';
import { useState } from 'react';
import { useSequence } from 'src/hooks/use-sequence';
import { toast } from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';
import { useSequenceSteps } from 'src/hooks/use-sequence-steps';

export const CreateSequenceModal = ({
    title,
    showCreateSequenceModal,
    setShowCreateSequenceModal,
}: {
    title: string;
    showCreateSequenceModal: boolean;
    setShowCreateSequenceModal: (showCreateSequenceModal: boolean) => void;
}) => {
    const { t } = useTranslation();
    const { createSequence } = useSequence();
    const { createDefaultSequenceSteps } = useSequenceSteps();

    const [loading, setLoading] = useState<boolean>(false);
    const [sequenceName, setSequenceName] = useState<string>('');

    const handleCreateSequence = async () => {
        setLoading(true);
        try {
            if (sequenceName === '') return;
            const data = await createSequence(sequenceName);
            if (!data) {
                throw new Error('Failed to get sequence id');
            }
            await createDefaultSequenceSteps(data.id);
            toast.success('Sequence created successfully');
        } catch (error) {
            clientLogger(error, 'error');
            toast.error('Failed to create sequence, please try again later');
        } finally {
            setLoading(false);
            setShowCreateSequenceModal(false);
        }
    };

    return (
        <Modal title={title} visible={showCreateSequenceModal} onClose={() => setShowCreateSequenceModal(false)}>
            <div className="space-y-4 py-6">
                <div className="font-semibold text-gray-600">{t('sequences.sequenceInfo')}</div>
                <div>
                    <div className="py-2 text-xs font-semibold text-gray-500">
                        {t('sequences.sequenceName')}
                        {' *'}
                    </div>
                    <input
                        type="text"
                        required
                        className="w-full rounded-md border border-gray-200 shadow-sm placeholder:font-medium placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        placeholder={t('sequences.sequenceNamePlaceholder') as string}
                        onChange={(e) => setSequenceName(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                    <Button variant="secondary" onClick={() => setShowCreateSequenceModal(false)}>
                        {t('sequences.cancel')}{' '}
                    </Button>
                    {loading ? (
                        <Button>
                            <Spinner className="h-5 w-5 fill-primary-500 text-white" />
                        </Button>
                    ) : (
                        <Button onClick={handleCreateSequence} type="submit">
                            {t('sequences.createNewSequence')}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
