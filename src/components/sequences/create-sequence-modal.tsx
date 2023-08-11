import { useTranslation } from 'react-i18next';
import { Modal } from '../modal';
import { Button } from '../button';
import { Spinner } from '../icons';
import { useState } from 'react';

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
    //eslint-disable-next-line
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreateSequence = async () => {
        //create sequence
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
