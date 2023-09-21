import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect } from 'react';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import type { FunnelStatus } from 'src/utils/api/db';
import { CollabAddPost } from '../components/collab-add-post';
import { CollabAffiliateLinkInput } from '../components/collab-affiliate-link-input';
import { CollabFeeInput } from '../components/collab-fee-input';
import { CollabScheduledPostDateInput } from '../components/collab-scheduled-post-date-input';
import { CollabVideoDetailsInput } from '../components/collab-video-details-input';
import type { NoteData } from '../components/note';
import { OutreachCollabStatusInput } from '../components/outreach-collab-status-input';
import { OutreachNextStepsInput } from '../components/outreach-next-steps-input';
import { OutreachNotesInput } from '../components/outreach-notes-input';
import { useProfileScreenContext, useUiState } from '../screens/profile-screen-context';
import { useTranslation } from 'react-i18next';
import type { CheckboxDropdownItemData } from '../components/checkbox-dropdown-item';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { UpdateInfluencerStatus } from 'src/utils/analytics/events';

export const COLLAB_STATUS_OPTIONS: CheckboxDropdownItemData[] = [
    {
        id: 'Negotiating',
        label: 'Negotiating',
        style: 'bg-blue-100 text-blue-500',
    },
    {
        id: 'Confirmed',
        label: 'Confirmed',
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'Shipped',
        label: 'Shipped',
        style: 'bg-yellow-100 text-yellow-500',
    },
    {
        id: 'Received',
        label: 'Received',
        style: 'bg-green-100 text-green-500',
    },
    {
        id: 'Content Approval',
        label: 'Content Approval',
        style: 'bg-pink-100 text-pink-500',
    },
    {
        id: 'Posted',
        label: 'Posted',
        style: 'bg-cyan-100 text-cyan-500',
    },
    {
        id: 'Rejected',
        label: 'Rejected',
        style: 'bg-red-100 text-red-500',
    },
];

export type ProfileNotes = {
    collabStatus: FunnelStatus;
    notes: string;
    nextStep: string;
    fee: string | number;
    videoDetails: string;
    affiliateLink: string;
    scheduledPostDate: string;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    onUpdate?: (key: keyof ProfileNotes, value: any) => void;
};

// eslint-disable-next-line complexity
export const ProfileNotesTab = ({ profile, ...props }: Props) => {
    const { onUpdate } = { onUpdate: () => null, ...props };
    const { t } = useTranslation();
    const { state: data } = useProfileScreenContext();
    const [_uiState, setUiState] = useUiState();
    const { getNotes, saveNote } = useSequenceInfluencerNotes();
    const { track } = useRudderstackTrack();

    const handleSaveNotes = useCallback(
        (value: string) => {
            saveNote
                .call({
                    comment: value,
                    influencer_social_profile_id: profile.influencer_social_profile_id,
                    sequence_influencer_id: profile.id,
                })
                .then(() => {
                    saveNote.refresh();
                });
        },
        [profile, saveNote],
    );

    const handleCollabStatusUpate = (items: CheckboxDropdownItemData[]) => {
        if (!profile) return;
        if (!profile.influencer_social_profile_id) throw new Error('Influencer social profile id missing');
        const selected = items.length > 0 ? items[0].id : data.notes.collabStatus;
        onUpdate('collabStatus', selected);
        track(UpdateInfluencerStatus, {
            influencer_id: profile?.influencer_social_profile_id,
            current_status: profile.funnel_status,
            selected_status: selected,
        });
    };

    useEffect(() => {
        // load posts when the modal is opened
        if (getNotes.isLoading !== null) return;

        getNotes.call(profile.id, { current_user_only: true }).then((notes: NoteData[]) => {
            const currentNote: Partial<NoteData> = notes && notes.length > 0 ? notes[0] : { content: '' };
            onUpdate('notes', currentNote.content);
        });
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [getNotes, onUpdate, profile]);

    return (
        <>
            <div className="grid grid-flow-row auto-rows-max gap-4">
                <div className="gap-4.5 inline-flex items-center justify-between">
                    <div className="text-xl font-semibold leading-normal tracking-tight text-gray-600">
                        {t('profile.outreach') || 'Outreach'}
                    </div>
                </div>
                <section className="grid grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-none">
                    <OutreachCollabStatusInput
                        label={t('profile.collabStatus') as string}
                        onUpdate={handleCollabStatusUpate}
                        options={COLLAB_STATUS_OPTIONS}
                        selected={[data.notes.collabStatus]}
                    />

                    <OutreachNextStepsInput
                        label={t('profile.nextStep') as string}
                        placeholder={t('profile.nextStepPlaceholder')}
                        value={data.notes.nextStep}
                        onChange={(e) => onUpdate('nextStep', e.currentTarget.value)}
                    />
                </section>

                <OutreachNotesInput
                    label={t('profile.notes')}
                    placeholder={t('profile.notesPlaceholder') as string}
                    buttonText={t('profile.addNoteButton')}
                    disabled={getNotes.isLoading === true || saveNote.isLoading === true}
                    value={data.notes.notes}
                    onUpdate={(value) => onUpdate('notes', value)}
                    onSave={handleSaveNotes}
                    onOpenList={() =>
                        setUiState((s) => {
                            return { ...s, isNotesListOverlayOpen: true };
                        })
                    }
                />

                <div className="h-px border border-neutral-200" />

                <div className="gap-4.5 inline-flex items-center justify-between">
                    <div className="text-xl font-semibold leading-normal tracking-tight text-gray-600">
                        {t('profile.collab') || 'Collab'}
                    </div>
                </div>
                <section className="grid grid-cols-2 gap-4">
                    <CollabFeeInput
                        label={t('profile.fee') || 'Fee (USD)'}
                        value={data.notes.fee}
                        onInput={(e) => onUpdate('fee', e.currentTarget.value)}
                    />
                    <CollabScheduledPostDateInput
                        label={t('profile.scheduledPostDate')}
                        value={data.notes.scheduledPostDate}
                        onInput={(e) => onUpdate('scheduledPostDate', e.currentTarget.value)}
                    />
                </section>
                <section className="grid grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-none">
                    <CollabVideoDetailsInput
                        label={t('profile.videoDetails') as string}
                        placeholder={t('profile.videoDetailsPlaceholder')}
                        value={data.notes.videoDetails}
                        onInput={(e) => onUpdate('videoDetails', e.currentTarget.value)}
                    />
                    <CollabAffiliateLinkInput
                        label={t('profile.affiliateLink') as string}
                        placeholder={t('profile.affiliateLinkPlaceholder')}
                        value={data.notes.affiliateLink}
                        onInput={(e) => onUpdate('affiliateLink', e.currentTarget.value)}
                    />
                </section>

                <CollabAddPost
                    label={t('profile.posts')}
                    buttonText={t('profile.addPostButton') || 'Add Post'}
                    profile={profile}
                />
            </div>
        </>
    );
};
