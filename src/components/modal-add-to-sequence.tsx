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
import { AddInfluencerToSequence, StartSequenceForInfluencer } from 'src/utils/analytics/events';
import type { AddInfluencerToSequencePayload } from 'src/utils/analytics/events/outreach/add-influencer-to-sequence';
import type { StartSequenceForInfluencerPayload } from 'src/utils/analytics/events/outreach/start-sequence-for-influencer';
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
    const { t } = useTranslation();
    const { sequences: allSequences } = useSequences();
    const sequences = allSequences?.filter((sequence) => !sequence.deleted);
    const { track } = useRudderstackTrack();
    const {
        socialProfile,
        report,
        errorMessage: reportErrorMessage,
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

    const handleAddToSequence = useCallback(async () => {
        let sequenceInfluencer: Awaited<ReturnType<typeof createSequenceInfluencer>> | null = null;
        const trackingPayload: AddInfluencerToSequencePayload = {
            influencer_id: socialProfile?.id || '', // we confirm these later down
            sequence_id: sequence?.id || '',
            sequence_influencer_id: null,
            is_success: true,
            is_sequence_autostart: sequence?.auto_start || false,
        };
        try {
            if (!sequence) {
                track(AddInfluencerToSequence, {
                    influencer_id: null,
                    sequence_id: null,
                    sequence_influencer_id: null,
                    is_success: false,
                    is_sequence_autostart: null,
                    extra_info: { error: 'Missing sequence' },
                });
                throw new Error('Missing selectedSequence');
            }
            if (!socialProfile?.id) {
                track(AddInfluencerToSequence, {
                    influencer_id: null,
                    sequence_id: sequence.id,
                    sequence_influencer_id: null,
                    is_success: false,
                    is_sequence_autostart: null,
                    extra_info: { error: 'Missing socialProfileId' },
                });
                throw new Error('Missing socialProfileId');
            }
            if (!creatorProfile.user_id) {
                track(AddInfluencerToSequence, {
                    influencer_id: socialProfile.id,
                    sequence_id: sequence.id,
                    sequence_influencer_id: null,
                    is_success: false,
                    is_sequence_autostart: null,
                    extra_info: { error: 'Missing user_id from user_profile' },
                });
                throw new Error('Missing creator.user_id');
            }
            const tags = getRelevantTags();
            setSubmitting(true);

            sequenceInfluencer = await createSequenceInfluencer(socialProfile, tags, creatorProfile.user_id);
            trackingPayload.sequence_influencer_id = sequenceInfluencer.id;

            refreshSequenceInfluencers();
            toast.success(t('creators.addToSequenceSuccess'));
            track(AddInfluencerToSequence, trackingPayload);
        } catch (error: any) {
            const errorMessageAndStack = `Message: ${error?.message}\nStack Trace: ${error?.stack}`;
            clientLogger(error, 'error');
            toast.error(t('creators.addToSequenceError'));

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: errorMessageAndStack };
            track(AddInfluencerToSequence, trackingPayload);
            return;
        }
        const startSequencePayload: StartSequenceForInfluencerPayload = {
            influencer_id: null,
            sequence_id: null,
            sequence_influencer_id: null,
            is_success: true,
        };

        try {
            if (sequenceInfluencer && sequenceInfluencer.email && sequence.auto_start) {
                startSequencePayload.influencer_id = sequenceInfluencer.influencer_social_profile_id;
                startSequencePayload.sequence_id = sequenceInfluencer.sequence_id;
                startSequencePayload.sequence_influencer_id = sequenceInfluencer.id;

                const results = await sendSequence([sequenceInfluencer]);
                const failed = results.filter((result) => result.error);
                const succeeded = results.filter((result) => !result.error);

                track(StartSequenceForInfluencer, {
                    ...startSequencePayload,
                    sent_success: succeeded,
                    sent_success_count: succeeded.length,
                    sent_failed: failed,
                    sent_failed_count: failed.length,
                });
                if (succeeded.length > 0) {
                    toast.success(t('sequences.number_emailsSuccessfullyScheduled', { number: succeeded.length }));
                }
                if (failed.length > 0) {
                    toast.error(t('sequences.number_emailsFailedToSchedule', { number: failed.length }));
                }
            }
        } catch (error: any) {
            clientLogger(error, 'error');
            const errorMessageAndStack = `Message: ${error?.message}\nStack Trace: ${error?.stack}`;
            track(StartSequenceForInfluencer, {
                ...startSequencePayload,
                is_success: false,
                extra_info: { error: errorMessageAndStack },
            });

            toast.error(error?.message ?? 'Unknown error auto-starting sequence');
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

    let errorMessage = reportErrorMessage;

    if (!loadingReport) {
        if (!report?.user_profile.user_id) {
            errorMessage = 'Missing influencer data: user_id';
        }
        if (!socialProfile?.id) {
            errorMessage = 'Missing influencer data: socialProfile';
        }
    }

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

                {usageExceeded && (
                    <div>
                        <Link href="/pricing">
                            <Button>{t('account.subscription.upgradeSubscription')}</Button>
                        </Link>
                    </div>
                )}
                {errorMessage?.length > 0 && <div className="mb-2 text-red-600">{errorMessage}</div>}
                {!usageExceeded && !(errorMessage?.length > 0) && (
                    <Button onClick={handleAddToSequence} type="submit" disabled={submitting || loadingReport}>
                        {loadingReport ? (
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
