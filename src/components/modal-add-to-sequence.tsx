import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAllSequenceInfluencersIqDataIdAndSequenceName } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { useReport } from 'src/hooks/use-report';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { AddInfluencerToSequence } from 'src/utils/analytics/events';
import type { Sequence } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import { Button } from './button';
import { Info, Spinner } from './icons';
import { Modal } from './modal';

// eslint-disable-next-line complexity
export const AddToSequenceModal = ({
    show,
    setShow,
    creatorProfile,
    platform,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    creatorProfile: CreatorUserProfile;
    platform: CreatorPlatform;
}) => {
    const { i18n, t } = useTranslation();
    const { sequences } = useSequences();
    const { track } = useRudderstackTrack();
    const {
        socialProfile,
        report,
        errorMessage,
        usageExceeded,
        loading: loadingReport,
    } = useReport({
        platform,
        creator_id: creatorProfile.user_id || '',
    });

    const [sequence, setSequence] = useState<Sequence | null>(sequences?.[0] ?? null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { sendSequence } = useSequence(sequence?.id);
    const { refresh: refreshSequenceInfluencers } = useAllSequenceInfluencersIqDataIdAndSequenceName();

    const { createSequenceInfluencer } = useSequenceInfluencers(sequence ? [sequence.id] : []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value) ?? null;
        setSequence(selectedSequenceObject);
    };

    // get the top 3 tags from relevant_tags of the report, then pass it to tags of sequence influencer
    const getRelevantTags = useCallback(() => {
        if (!report || !report.user_profile.relevant_tags) {
            return [];
        }
        const relevantTags = report.user_profile.relevant_tags;
        return relevantTags.slice(0, 3).map((tag) => tag.tag);
    }, [report]);

    const dataLoading = loadingReport || !sequence || !creatorProfile.user_id || !socialProfile;
    const handleAddToSequence = useCallback(async () => {
        if (!sequence) {
            track(AddInfluencerToSequence, {
                influencer_id: null,
                sequence_id: null,
                sequence_influencer_id: null,
                is_success: false,
                is_sequence_autostart: null,
                extra_info: { error: "Missing sequence" }
            })
            throw new Error('Missing selectedSequence');
        }
        if (!socialProfile?.id) {
            track(AddInfluencerToSequence, {
                influencer_id: null,
                sequence_id: sequence.id,
                sequence_influencer_id: null,
                is_success: false,
                is_sequence_autostart: null,
                extra_info: { error: "Missing socialProfileId" }
            })
            throw new Error('Missing socialProfileId');
        }
        if (!creatorProfile.user_id) {
            track(AddInfluencerToSequence, {
                influencer_id: socialProfile.id,
                sequence_id: sequence.id,
                sequence_influencer_id: null,
                is_success: false,
                is_sequence_autostart: null,
                extra_info: { error: "Missing user_id from user_profile" }
            })
            throw new Error('Missing creator.user_id');
        }
        const tags = getRelevantTags();
        setSubmitting(true);
        try {
            const sequenceInfluencer = await createSequenceInfluencer(
                socialProfile.id,
                tags,
                creatorProfile.user_id,
                socialProfile?.email,
            );
            refreshSequenceInfluencers();

            if (sequenceInfluencer.email && sequence.auto_start) {
                await sendSequence([sequenceInfluencer]);
            }

            toast.success(t('creators.addToSequenceSuccess'));

            track(AddInfluencerToSequence, {
                influencer_id: socialProfile.id,
                sequence_id: sequence.id,
                sequence_influencer_id: sequenceInfluencer.id,
                is_success: true,
                is_sequence_autostart: sequence.auto_start,
            })
        } catch (error) {
            clientLogger(error);
            toast.error(t('creators.addToSequenceError'));

            track(AddInfluencerToSequence, {
                influencer_id: socialProfile.id,
                sequence_id: sequence.id,
                sequence_influencer_id: null,
                is_success: false,
                is_sequence_autostart: null,
                extra_info: { error: String(error) }
            })
        } finally {
            setSubmitting(false);
            setShow(false);
        }
    }, [
        track,
        createSequenceInfluencer,
        creatorProfile.user_id,
        getRelevantTags,
        sequence,
        sendSequence,
        setShow,
        socialProfile,
        t,
        refreshSequenceInfluencers,
    ]);

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
            <div className="flex justify-end space-x-3 p-6">
                <Button variant="secondary" onClick={() => setShow(false)}>
                    {t('creators.cancel')}
                </Button>

                {usageExceeded && (
                    <div>
                        <Link href="/pricing">
                            <Button>{t('account.subscription.upgradeSubscription')}</Button>
                        </Link>
                    </div>
                )}
                {errorMessage?.length > 0 && <div className="mb-2 text-red-600">{errorMessage}</div>}
                {!usageExceeded && !(errorMessage?.length > 0) && (
                    <Button onClick={handleAddToSequence} type="submit" disabled={submitting || dataLoading}>
                        {submitting || dataLoading ? (
                            <Spinner className="h-5 w-5 fill-primary-500 text-white" />
                        ) : (
                            t('creators.addToSequence')
                        )}
                    </Button>
                )}
            </div>
        </Modal>
    );
};
