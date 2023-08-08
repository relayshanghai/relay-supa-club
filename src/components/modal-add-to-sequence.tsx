import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './modal';
import { Button } from './button';
import { InfoIcon } from './icons';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import { useReport } from 'src/hooks/use-report';

export const AddToSequenceModal = ({
    show,
    setShow,
    selectedCreator,
    platform,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    selectedCreator: CreatorUserProfile;
    platform: CreatorPlatform;
}) => {
    const { i18n, t } = useTranslation();
    const { sequences } = useSequences();
    const { influencerSocialData } = useReport({ platform, creator_id: selectedCreator.user_id || '' });
    const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(sequences?.[0] ?? null);
    const { createSequenceInfluencer } = useSequenceInfluencers(selectedSequence?.id);
    // console.log(selectedCreator);
    // console.log(influencerSocialData.id);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value) ?? null;
        setSelectedSequence(selectedSequenceObject);
    };
    const handleAddToSequence = async () => {
        if (!selectedSequence) {
            throw new Error('Missing selectedSequence');
        }
        if (!influencerSocialData?.id) {
            throw new Error('Missing influencerSocialData');
        }
        try {
            const res = await createSequenceInfluencer(influencerSocialData?.id);
            //eslint-disable-next-line
            console.log(res);
            toast.success('Added to sequence successfully');
        } catch (error) {
            clientLogger(error);
            toast.error('An error occurred, please try again');
        }
    };

    return (
        <Modal
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <div>
                <div className="space-y-4 p-6">
                    <div>
                        <div className="mb-2 font-semibold text-gray-800">{t('creators.sequence')}</div>
                        <select
                            data-testid="sequence-dropdown"
                            onChange={(e) => handleSelectChange(e)}
                            value={selectedSequence?.name}
                            className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none"
                        >
                            {sequences?.length === 0 && <option>{t('creators.noSequence')}</option>}
                            {sequences?.map((sequence) => (
                                <option key={sequence.id}>{sequence.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-start rounded-md bg-blue-50 p-4">
                        <InfoIcon className="mr-4 mt-1 box-border h-4 w-4 flex-none text-blue-500" />
                        <div className="text-gray-500">
                            {t('creators.addToSequenceNotes')} {new Date().toLocaleDateString(i18n.language)}{' '}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-6">
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        {t('creators.cancel')}
                    </Button>
                    <Button onClick={handleAddToSequence} type="submit">
                        {t('creators.addToSequence')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
