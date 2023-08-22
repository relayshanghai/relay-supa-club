import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './modal';
import { Button } from './button';
import { Info, Spinner } from './icons';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import type { Sequence } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import { useReport } from 'src/hooks/use-report';
import { useSequence } from 'src/hooks/use-sequence';

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
    const { sequences, refreshSequences } = useSequences();
    const { socialProfile, report } = useReport({ platform, creator_id: selectedCreator.user_id || '' });

    const [selectedSequence, setSelectedSequence] = useState<Sequence | undefined>(sequences && sequences[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const [socialProfileId, setSocialProfileId] = useState(() => socialProfile?.id ?? null);
    const { sendSequence, refreshSequence } = useSequence(selectedSequence?.id);

    const { sequenceInfluencers, refreshSequenceInfluencers, createSequenceInfluencer } = useSequenceInfluencers(
        selectedSequence ? [selectedSequence.id] : [],
    );
    const hasInfluencer = useMemo(() => {
        if (!sequenceInfluencers || !selectedSequence) {
            return false;
        }

        return sequenceInfluencers.some(
            ({ sequence_id, iqdata_id }) =>
                sequence_id === selectedSequence.id && iqdata_id === selectedCreator.user_id,
        );
    }, [selectedCreator, selectedSequence, sequenceInfluencers]);

    useEffect(() => {
        if (!sequences || selectedSequence) return;
        setSelectedSequence(sequences[0]);
    }, [sequences, selectedSequence]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value);
        setSelectedSequence(selectedSequenceObject);
    };

    // get the top 3 tags from relevant_tags of the report, then pass it to tags of sequence influencer
    const getRelevantTags = useCallback(() => {
        if (!report || !report.user_profile.relevant_tags) {
            return [];
        }
        const relevantTags = report.user_profile.relevant_tags;
        return relevantTags.slice(0, 3).map((tag) => tag.tag);
    }, [report]);

    const handleAddToSequence = useCallback(async () => {
        if (!selectedSequence) {
            throw new Error('Missing selectedSequence');
        }
        if (socialProfileId) {
            const tags = getRelevantTags();
            setLoading(true);
            try {
                const sequenceInfluencer = await createSequenceInfluencer(socialProfileId, tags);

                if (sequenceInfluencer.email && selectedSequence.auto_start) {
                    await sendSequence([sequenceInfluencer]);
                }
                toast.success(t('creators.addToSequenceSuccess'));
            } catch (error) {
                clientLogger(error);
                toast.error(t('creators.addToSequenceError'));
            } finally {
                setLoading(false);
                setShow(false);
            }
            refreshSequences();
            refreshSequence();
            refreshSequenceInfluencers();
        }
    }, [
        createSequenceInfluencer,
        getRelevantTags,
        selectedSequence,
        sendSequence,
        setShow,
        socialProfileId,
        t,
        refreshSequenceInfluencers,
        refreshSequence,
        refreshSequences,
    ]);

    useEffect(() => {
        if (socialProfile?.id) {
            setSocialProfileId(socialProfile.id);
        }
    }, [socialProfile]);

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
                            className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none  focus:border-primary-500 focus:ring-primary-500"
                        >
                            {(!sequences || sequences.length === 0) && <option>{t('creators.noSequence')}</option>}
                            {sequences?.map((sequence) => (
                                <option key={sequence.id}>{sequence.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-start rounded-md bg-primary-50 p-4">
                        <Info className="mr-4 mt-1 h-6 w-6 flex-none text-primary-500" />
                        <div className="text-primary-500">
                            {t('creators.addToSequenceNotes')} {new Date().toLocaleDateString(i18n.language)}{' '}
                        </div>
                    </div>
                </div>
                <section className="flex justify-end space-x-3 p-6">
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        {t('creators.cancel')}
                    </Button>
                    {loading ? (
                        <Button>
                            <Spinner className="h-5 w-5 fill-primary-500 text-white" />
                        </Button>
                    ) : (
                        <Button
                            disabled={hasInfluencer}
                            data-testid="add-to-sequence-modal"
                            onClick={handleAddToSequence}
                            type="submit"
                        >
                            {t('creators.addToSequence')}
                        </Button>
                    )}
                </section>
            </div>
        </Modal>
    );
};
