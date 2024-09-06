import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceSteps } from 'src/hooks/use-sequence-steps';
import { useTemplateVariables } from 'src/hooks/use-template_variables';
import { CreateSequence } from 'src/utils/analytics/events';
import { clientLogger } from 'src/utils/logger-client';
import { Button } from '../button';
import { Spinner } from '../icons';
import { Modal } from '../modal';

export const CreateSequenceModal = ({
    title,
    showCreateSequenceModal,
    setShowCreateSequenceModal,
    selectedSequenceName,
}: {
    title: string;
    showCreateSequenceModal: boolean;
    setShowCreateSequenceModal: (showCreateSequenceModal: boolean) => void;
    selectedSequenceName?: string;
}) => {
    const { t } = useTranslation();
    const { createSequence } = useSequence();
    const { createDefaultSequenceSteps } = useSequenceSteps();
    const { createDefaultTemplateVariables } = useTemplateVariables();
    const { track } = useRudderstackTrack();

    const [loading, setLoading] = useState<boolean>(false);
    const [sequenceName, setSequenceName] = useState<string>('');

    useEffect(() => {
        setSequenceName(selectedSequenceName || '');
    }, [showCreateSequenceModal, selectedSequenceName]);

    const handleCreateSequence = async () => {
        setLoading(true);
        try {
            if (sequenceName === '') return;

            const data = await createSequence(sequenceName);

            if (!data) {
                track(CreateSequence, {
                    sequence_id: null,
                    sequence_name: sequenceName,
                    is_success: false,
                    extra_info: { error: 'Failed to get sequence' },
                });
                throw new Error('Failed to get sequence id');
            }

            track(CreateSequence, {
                sequence_id: data.id,
                sequence_name: sequenceName,
                is_success: true,
            });

            await createDefaultSequenceSteps(data.id);
            await createDefaultTemplateVariables(data.id);
            toast.success(t('sequences.createSequenceSuccess'));
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('sequences.createSequenceError'));

            track(CreateSequence, {
                sequence_id: null,
                sequence_name: sequenceName,
                is_success: false,
                extra_info: { error: String(error) },
            });
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
                        onChange={(e) => setSequenceName(e.target.value.trim())}
                        value={sequenceName}
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
