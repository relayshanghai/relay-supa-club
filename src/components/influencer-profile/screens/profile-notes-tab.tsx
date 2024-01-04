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
import { AddNoteToInfluencerProfile } from 'src/utils/analytics/events';
import type { CheckboxDropdownItemData } from '../components/checkbox-dropdown-item';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { UpdateInfluencerStatus } from 'src/utils/analytics/events';
import type { UpdateInfluencerProfilePayload } from 'src/utils/analytics/events/outreach/update-influencer-profile';
import { ShippingDetailsCityInput } from '../components/shipping-details-city-input';
import { ShippingDetailsCountryInput } from '../components/shipping-details-country-input';
import { ShippingDetailsFullAddressInput } from '../components/shipping-details-full-address-input';
import { ShippingDetailsNameInput } from '../components/shipping-details-name-input';
import { ShippingDetailsPhoneNumberInput } from '../components/shipping-details-phone-number-input';
import { ShippingDetailsPostalCodeInput } from '../components/shipping-details-postal-code-input';
import { ShippingDetailsStateInput } from '../components/shipping-details-state-input';
import { ShippingDetailsStreetAddressInput } from '../components/shipping-details-street-address-input';
import { ShippingDetailsTrackingCodeInput } from '../components/shipping-details-tracking-code-input';

export type ProfileShippingDetails = {
    name: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    trackingCode: string;
    fullAddress: string;
};

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

export type CommonKeys = {
    collabStatus: FunnelStatus;
    notes: string;
    nextStep: string;
    fee: string | number;
    videoDetails: string;
    affiliateLink: string;
    scheduledPostDate: string;
    name: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    trackingCode: string;
    fullAddress: string;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    onUpdateNotes?: (key: keyof CommonKeys, value: any) => void;
    onUpdateShippingDetails?: (key: keyof CommonKeys, value: any) => void;
    triggerSubmitNotes?: (key: keyof CommonKeys, value: any) => void;
    triggerSubmitShippingDetails?: (key: keyof CommonKeys, value: any) => void;
    trackProfileFieldUpdate: (payload: Omit<UpdateInfluencerProfilePayload, 'batch_id'>) => void;
};

// eslint-disable-next-line complexity
export const ProfileNotesTab = ({ profile, ...props }: Props) => {
    const { onUpdateNotes } = { onUpdateNotes: () => null, ...props };
    const { onUpdateShippingDetails } = { onUpdateShippingDetails: () => null, ...props };
    const { triggerSubmitNotes } = { triggerSubmitNotes: () => null, ...props };
    const { triggerSubmitShippingDetails } = { triggerSubmitShippingDetails: () => null, ...props };
    const { t } = useTranslation();
    const { state: data } = useProfileScreenContext();
    const [_uiState, setUiState] = useUiState();
    const { getNotes, saveNote } = useSequenceInfluencerNotes();
    const { track } = useRudderstackTrack();

    const handleSaveNotes = useCallback(
        (value: string) => {
            if (!profile.influencer_social_profile_id) {
                throw new Error('Influencer social profile id missing');
            }
            saveNote
                .call({
                    comment: value,
                    influencer_social_profile_id: profile.influencer_social_profile_id,
                    sequence_influencer_id: profile.id,
                })
                .then(() => {
                    saveNote.refresh();
                });
            track(AddNoteToInfluencerProfile, {
                influencer_id: profile.influencer_social_profile_id,
                note: value,
            });
        },
        [profile, saveNote, track],
    );

    const handleCollabStatusUpate = (items: CheckboxDropdownItemData[]) => {
        if (!profile) return;
        if (!profile.influencer_social_profile_id && !profile.influencer_social_profile_id)
            throw new Error('Influencer social profile id missing');
        const selected = items.length > 0 ? items[0].id : data.notes.collabStatus;
        onUpdateNotes('collabStatus', selected);
        triggerSubmitNotes('collabStatus', selected);
        track(UpdateInfluencerStatus, {
            influencer_id: profile.influencer_social_profile_id,
            current_status: profile.funnel_status,
            selected_status: selected,
        });
    };

    useEffect(() => {
        // load posts when the modal is opened
        if (getNotes.isLoading !== null) return;

        getNotes.call(profile.id, { current_user_only: true }).then((notes: NoteData[]) => {
            const currentNote: Partial<NoteData> = notes && notes.length > 0 ? notes[0] : { content: '' };
            onUpdateNotes('notes', currentNote.content);
        });
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [getNotes, onUpdateNotes, profile]);

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
                        onBlur={(e) => triggerSubmitNotes('nextStep', e.currentTarget.value)}
                        onChange={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Next Step',
                                previously_empty: data.notes.nextStep === '',
                            });
                            onUpdateNotes('nextStep', e.currentTarget.value);
                        }}
                    />
                </section>

                <OutreachNotesInput
                    label={t('profile.notes')}
                    placeholder={t('profile.notesPlaceholder') as string}
                    buttonText={t('profile.addNoteButton')}
                    disabled={getNotes.isLoading === true || saveNote.isLoading === true}
                    value={data.notes.notes}
                    onUpdate={(value) => onUpdateNotes('notes', value)}
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
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Fee',
                                previously_empty: data.notes.fee === '',
                            });
                            onUpdateNotes('fee', e.currentTarget.value);
                            triggerSubmitNotes('fee', e.currentTarget.value);
                        }}
                    />
                    <CollabScheduledPostDateInput
                        label={t('profile.scheduledPostDate')}
                        value={data.notes.scheduledPostDate}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Scheduled Post Date',
                                previously_empty: data.notes.scheduledPostDate === '',
                            });
                            onUpdateNotes('scheduledPostDate', e.currentTarget.value);
                            triggerSubmitNotes('scheduledPostDate', e.currentTarget.value);
                        }}
                    />
                </section>
                <section className="grid grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-none">
                    <CollabVideoDetailsInput
                        label={t('profile.videoDetails') as string}
                        placeholder={t('profile.videoDetailsPlaceholder')}
                        value={data.notes.videoDetails}
                        onBlur={(e) => triggerSubmitNotes('videoDetails', e.currentTarget.value)}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Video Details',
                                previously_empty: data.notes.videoDetails === '',
                            });
                            onUpdateNotes('videoDetails', e.currentTarget.value);
                        }}
                    />
                    <CollabAffiliateLinkInput
                        label={t('profile.affiliateLink') as string}
                        placeholder={t('profile.affiliateLinkPlaceholder')}
                        value={data.notes.affiliateLink}
                        onBlur={(e) => triggerSubmitNotes('affiliateLink', e.currentTarget.value)}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Affiliate Link',
                                previously_empty: data.notes.affiliateLink === '',
                            });
                            onUpdateNotes('affiliateLink', e.currentTarget.value);
                            triggerSubmitNotes('affiliateLink', e.currentTarget.value);
                        }}
                    />
                </section>

                <CollabAddPost
                    label={t('profile.posts')}
                    buttonText={t('profile.addPostButton') || 'Add Post'}
                    profile={profile}
                />
            </div>
            <p className="mb-2 text-xl font-semibold text-gray-600">{t('profile.shippingDetails')}</p>
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsNameInput
                    label={t('profile.name') as string}
                    placeholder="D’Jan Curtis"
                    value={data.shippingDetails.name}
                    onBlur={(e) => triggerSubmitShippingDetails('name', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'Name',
                            previously_empty: data.shippingDetails.name === '',
                        });
                        onUpdateShippingDetails('name', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsPhoneNumberInput
                    label={t('profile.phoneNumber') as string}
                    placeholder="1-433-3453456"
                    value={data.shippingDetails.phoneNumber}
                    onBlur={(e) => triggerSubmitShippingDetails('phoneNumber', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'Phone Number',
                            previously_empty: data.shippingDetails.phoneNumber === '',
                        });
                        onUpdateShippingDetails('phoneNumber', e.currentTarget.value);
                    }}
                />
            </section>
            <div className="mb-6 h-px border border-neutral-200" />
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsStreetAddressInput
                    label={t('profile.streetAddress') as string}
                    placeholder="755 Roosevelt Street"
                    value={data.shippingDetails.streetAddress}
                    onBlur={(e) => triggerSubmitShippingDetails('streetAddress', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'Street Address',
                            previously_empty: data.shippingDetails.streetAddress === '',
                        });
                        onUpdateShippingDetails('streetAddress', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsCityInput
                    label={t('profile.city') as string}
                    placeholder="New York"
                    value={data.shippingDetails.city}
                    onBlur={(e) => triggerSubmitShippingDetails('city', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'City',
                            previously_empty: data.shippingDetails.city === '',
                        });
                        onUpdateShippingDetails('city', e.currentTarget.value);
                    }}
                />
            </section>
            <section className="grid grid-rows-1 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsStateInput
                    label={t('profile.state') as string}
                    placeholder="New York"
                    onBlur={(e) => triggerSubmitShippingDetails('state', e.currentTarget.value)}
                    value={data.shippingDetails.state}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'State',
                            previously_empty: data.shippingDetails.state === '',
                        });
                        onUpdateShippingDetails('state', e.currentTarget.value);
                    }}
                />
                <section className="grid grid-cols-2 gap-4">
                    <ShippingDetailsCountryInput
                        label={t('profile.country') as string}
                        placeholder="United States"
                        value={data.shippingDetails.country}
                        onBlur={(e) => triggerSubmitShippingDetails('country', e.currentTarget.value)}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Country',
                                previously_empty: data.shippingDetails.country === '',
                            });
                            onUpdateShippingDetails('country', e.currentTarget.value);
                        }}
                    />
                    <ShippingDetailsPostalCodeInput
                        label={t('profile.postalCode') as string}
                        placeholder="14450"
                        value={data.shippingDetails.postalCode}
                        onBlur={(e) => triggerSubmitShippingDetails('postalCode', e.currentTarget.value)}
                        onInput={(e) => {
                            props.trackProfileFieldUpdate({
                                influencer_id: profile.influencer_social_profile_id ?? '',
                                updated_field: 'Postal Code',
                                previously_empty: data.shippingDetails.postalCode === '',
                            });
                            onUpdateShippingDetails('postalCode', e.currentTarget.value);
                        }}
                    />
                </section>
            </section>
            <div className="mb-6 h-px border border-neutral-200" />
            <section className="grid grid-rows-2 gap-2 xl:grid-cols-2 xl:grid-rows-none xl:gap-4">
                <ShippingDetailsTrackingCodeInput
                    label={t('profile.trackingCode') as string}
                    value={data.shippingDetails.trackingCode}
                    onBlur={(e) => triggerSubmitShippingDetails('trackingCode', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'Tracking Code',
                            previously_empty: data.shippingDetails.trackingCode === '',
                        });
                        onUpdateShippingDetails('trackingCode', e.currentTarget.value);
                    }}
                />
                <ShippingDetailsFullAddressInput
                    label={t('profile.fullAddress') as string}
                    value={data.shippingDetails.fullAddress}
                    onBlur={(e) => triggerSubmitShippingDetails('fullAddress', e.currentTarget.value)}
                    onInput={(e) => {
                        props.trackProfileFieldUpdate({
                            influencer_id: profile.influencer_social_profile_id ?? '',
                            updated_field: 'Full Address',
                            previously_empty: data.shippingDetails.fullAddress === '',
                        });
                        onUpdateShippingDetails('fullAddress', e.currentTarget.value);
                    }}
                />
            </section>
        </>
    );
};
