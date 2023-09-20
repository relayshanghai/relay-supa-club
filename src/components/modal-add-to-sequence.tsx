import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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
import { useDB } from 'src/utils/client-db/use-client-db';
import { insertInfluencerSocialProfile } from 'src/utils/api/db/calls/influencers-insert';
import { useCompany } from 'src/hooks/use-company';
import { updateSequenceInfluencerIfSocialProfileAvailable } from './sequences/helpers';

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
    const { company } = useCompany();
    const { sequences: allSequences } = useSequences();
    const [sequenceInfluencer, setSequenceInfluencer] = useState<Awaited<
        ReturnType<typeof createSequenceInfluencer>
    > | null>(null);
    const sequences = allSequences?.filter((sequence) => !sequence.deleted);
    const { track } = useRudderstackTrack();
    const [suppressReportFetch, setSuppressReportFetch] = useState(true);
    const {
        socialProfile,
        report,
        usageExceeded,
        loading: loadingReport,
    } = useReport({
        platform,
        creator_id: creatorProfile.user_id || '',
        suppressFetch: suppressReportFetch,
    });

    const [sequence, setSequence] = useState<Sequence | null>(sequences?.[0] ?? null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { sendSequence } = useSequence(sequence?.id);
    const { refresh: refreshSequenceInfluencers } = useAllSequenceInfluencersIqDataIdAndSequenceName();

    const { createSequenceInfluencer, updateSequenceInfluencer } = useSequenceInfluencers(
        sequence ? [sequence.id] : [],
    );

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value) ?? null;
        setSequence(selectedSequenceObject);
    };
    const insertSocialProfile = useDB(insertInfluencerSocialProfile);

    const handleAddToSequence = useCallback(async () => {
        let newSequenceInfluencer: Awaited<ReturnType<typeof createSequenceInfluencer>> | null = null;
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
            if (!creatorProfile.user_id) {
                track(AddInfluencerToSequence, {
                    influencer_id: null,
                    sequence_id: null,
                    sequence_influencer_id: null,
                    is_success: false,
                    is_sequence_autostart: null,
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
            refreshSequenceInfluencers();
            toast.success(t('creators.addToSequenceSuccess'));
            track(AddInfluencerToSequence, trackingPayload);
            setSuppressReportFetch(false); // will start getting the report.
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
        creatorProfile,
        sequence,
        sendSequence,
        setShow,
        socialProfile,
        t,
        refreshSequenceInfluencers,
        platform,
        sequenceInfluencer,
    ]);

    useEffect(() => {
        // after the report is fetched, we update the sequence influencer row with the report data.
        if (!socialProfile || !sequenceInfluencer || !company) {
            return;
        }
        insertSocialProfile(socialProfile);
        updateSequenceInfluencerIfSocialProfileAvailable({
            sequenceInfluencer,
            socialProfile,
            report,
            updateSequenceInfluencer,
            company_id: company.id,
        });
    }, [report, socialProfile, sequenceInfluencer, company, updateSequenceInfluencer, insertSocialProfile]);

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

                {!usageExceeded && (
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
