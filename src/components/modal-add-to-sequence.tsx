import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { AddInfluencerToSequence, StartSequenceForInfluencer } from 'src/utils/analytics/events';
import type { AddInfluencerToSequencePayload } from 'src/utils/analytics/events/outreach/add-influencer-to-sequence';
import type { StartSequenceForInfluencerPayload } from 'src/utils/analytics/events/outreach/start-sequence-for-influencer';
import type { Sequence, SequenceInfluencer } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import { Button } from './button';
import { Info } from './icons';
import { Modal } from './modal';

// eslint-disable-next-line complexity
export const AddToSequenceModal = ({
    show,
    setShow,
    creatorProfile,
    platform,
    setSuppressReportFetch,
    sequence,
    setSequence,
    setSequenceInfluencer,
    sequences,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    creatorProfile: CreatorUserProfile;
    platform: CreatorPlatform;
    setSuppressReportFetch: (suppress: boolean) => void;
    sequence: Sequence | null;
    setSequence: (sequence: Sequence | null) => void;
    setSequenceInfluencer: (sequenceInfluencer: SequenceInfluencer | null) => void;
    sequences: Sequence[];
}) => {
    const { t } = useTranslation();

    const { track } = useRudderstackTrack();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const { sendSequence } = useSequence(sequence?.id);

    const { createSequenceInfluencer } = useSequenceInfluencers(sequence ? [sequence.id] : []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value) ?? null;
        setSequence(selectedSequenceObject);
    };

    const handleAddToSequence = useCallback(async () => {
        let newSequenceInfluencer: Awaited<ReturnType<typeof createSequenceInfluencer>> | null = null;
        const trackingPayload: AddInfluencerToSequencePayload & { $add?: any } = {
            sequence_id: sequence?.id || '',
            sequence_influencer_id: null,
            is_success: true,
            is_sequence_autostart: sequence?.auto_start || false,
        };
        try {
            if (!sequence) {
                track(AddInfluencerToSequence, {
                    ...trackingPayload,
                    extra_info: { error: 'Missing sequence' },
                });
                throw new Error('Missing selectedSequence');
            }
            if (!creatorProfile.user_id) {
                track(AddInfluencerToSequence, {
                    ...trackingPayload,
                    extra_info: { error: 'Missing creatorProfile.user_id' },
                });
                throw new Error('Missing creatorProfile.user_id');
            }

            setSubmitting(true);

            newSequenceInfluencer = await createSequenceInfluencer({
                name: creatorProfile.fullname || creatorProfile.username,
                username: creatorProfile.username,
                avatar_url: creatorProfile.picture || '',
                url: creatorProfile.url || '',
                iqdata_id: creatorProfile.user_id,
                sequence_id: sequence.id,
                platform,
            });
            setSequenceInfluencer(newSequenceInfluencer);
            trackingPayload.sequence_influencer_id = newSequenceInfluencer.id;
            trackingPayload['$add'] = { total_sequence_influencers: 1 };
            setSuppressReportFetch(false); // will start getting the report.

            toast.success(t('creators.addToSequenceSuccess'));
            track(AddInfluencerToSequence, trackingPayload);
            // when the report is fetched, we will update the sequence influencer row with the report data.
            // It will keep running when the modal is not visible
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
            if (newSequenceInfluencer && newSequenceInfluencer.email && sequence.auto_start) {
                startSequencePayload.influencer_id = newSequenceInfluencer.influencer_social_profile_id;
                startSequencePayload.sequence_id = newSequenceInfluencer.sequence_id;
                startSequencePayload.sequence_influencer_id = newSequenceInfluencer.id;

                const results = await sendSequence([newSequenceInfluencer]);
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
        createSequenceInfluencer,
        creatorProfile.fullname,
        creatorProfile.picture,
        creatorProfile.url,
        creatorProfile.user_id,
        creatorProfile.username,
        platform,
        sendSequence,
        sequence,
        setSequenceInfluencer,
        setShow,
        setSuppressReportFetch,
        t,
        track,
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

                <Button onClick={handleAddToSequence} type="submit" disabled={submitting}>
                    {t('creators.addToSequence')}
                </Button>
            </div>
        </Modal>
    );
};
