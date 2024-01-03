import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { Button } from 'src/components/button';
import { cls } from 'src/utils/classnames';
import { ProfileHeader } from '../components/profile-header';
import type { ProfileNotes } from './profile-notes-tab';
import { ProfileNotesTab } from './profile-notes-tab';
import { useProfileScreenContext } from './profile-screen-context';
import type { ProfileShippingDetails } from './profile-shipping-details-tab';
// import { ProfileShippingDetailsTab } from './profile-shipping-details-tab';
import { useTranslation } from 'react-i18next';
import { mapProfileToNotes, mapProfileToShippingDetails } from './profile-overlay-screen';
import { randomNumber } from 'src/utils/utils';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import {
    UpdateInfluencerProfile,
    type UpdateInfluencerProfilePayload,
} from 'src/utils/analytics/events/outreach/update-influencer-profile';
import { SaveInfluencerProfileUpdates } from 'src/utils/analytics/events';
import { SelectInfluencerProfileTab } from 'src/utils/analytics/events';

export type ProfileValue = {
    notes: ProfileNotes;
    shippingDetails: ProfileShippingDetails;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    selectedTab?: 'notes' | 'shipping-details';
    onUpdate?: (data: ProfileValue) => void;
    onCancel?: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const activeTabStyles = cls(['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']);

const mapProfileToFormData = (p: SequenceInfluencerManagerPage) => {
    if (!p) return null;
    return {
        notes: mapProfileToNotes(p),
        shippingDetails: mapProfileToShippingDetails(p),
    };
};

export const ProfileScreen = ({ profile, selectedTab, onUpdate, onCancel, ...props }: Props) => {
    const { state, setState } = useProfileScreenContext();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const batchId = useMemo(() => randomNumber(), [profile]);

    const { track } = useRudderstackTrack();
    const trackProfileFieldUpdate = useCallback(
        (payload: Omit<UpdateInfluencerProfilePayload, 'batch_id'>) => {
            track(UpdateInfluencerProfile, {
                ...payload,
                batch_id: batchId,
            });
        },
        [batchId, track],
    );

    useEffect(() => {
        if (!profile) return;
        const val = mapProfileToFormData(profile);
        if (!val) return;
        setState(val);
    }, [profile, setState]);

    const [selected, setSelected] = useState(selectedTab ?? 'notes');

    const handleTabClick = (tab: Props['selectedTab']) => {
        if (!profile.influencer_social_profile_id) {
            throw new Error('Influencer social profile id not found');
        }
        track(SelectInfluencerProfileTab, {
            influencer_id: profile.influencer_social_profile_id,
            influencer_current_status: profile.funnel_status,
            current_tab: selectedTab,
            selected: tab,
        });
        tab && setSelected(tab);
    };
    const { t } = useTranslation();

    const handleNotesDetailsUpdate = useCallback(
        (k: string, v: any) => {
            setState((state) => {
                return { ...state, notes: { ...state.notes, [k]: v } };
            });
        },
        [setState],
    );

    const handleShippingUpdate = useCallback(
        (k: string, v: any) => {
            setState((state) => {
                return { ...state, shippingDetails: { ...state.shippingDetails, [k]: v } };
            });
        },
        [setState],
    );

    const handleUpdateClick = useCallback(
        (data: ProfileValue) => {
            if (!profile.influencer_social_profile_id && !profile.influencer_social_profile_id)
                throw new Error('Influencer social profile id not found');

            onUpdate && onUpdate(data);

            track(SaveInfluencerProfileUpdates, {
                influencer_id: profile.influencer_social_profile_id,
                batch_id: batchId,
                action_type: 'Button',
            });
        },
        [onUpdate, profile, batchId, track],
    );

    return (
        <div {...props}>
            <div className="mb-4 h-28">
                <ProfileHeader profile={profile} className="relative left-4 top-2" />
            </div>

            <nav className="flex space-x-2">
                <button
                    onClick={() => handleTabClick('notes')}
                    type="button"
                    className={`${
                        selected === 'notes' ? activeTabStyles : ''
                    } inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-400`}
                >
                    {t('profile.notesTab')}
                </button>
                <button
                    onClick={() => handleTabClick('shipping-details')}
                    type="button"
                    className={`${
                        selected === 'shipping-details' ? activeTabStyles : ''
                    } inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-400`}
                >
                    {t('profile.shippingDetailsTab')}
                </button>
            </nav>

            <div className="p-8">
                <div className={`${selected !== 'notes' ? 'hidden' : ''}`}>
                    <ProfileNotesTab
                        profile={profile}
                        onUpdateNotes={(key, value) => {
                            handleNotesDetailsUpdate(key, value);
                        }}
                        onUpdateShippingDetails={(key, value) => {
                            handleShippingUpdate(key, value);
                        }}
                        triggerSubmitNotes={(key, value) => {
                            handleUpdateClick({ ...state, notes: { ...state.notes, [key]: value } });
                        }}
                        triggerSubmitShippingDetails={(key, value) => {
                            handleUpdateClick({
                                ...state,
                                shippingDetails: { ...state.shippingDetails, [key]: value },
                            });
                        }}
                        trackProfileFieldUpdate={trackProfileFieldUpdate}
                    />
                </div>
                <div className={`${selected !== 'shipping-details' ? 'hidden' : ''}`}>
                    {/*<ProfileShippingDetailsTab
                        profile={profile}
                        onUpdate={handleShippingUpdate}
                        trackProfileFieldUpdate={trackProfileFieldUpdate}
                    />*/}
                    <></>
                </div>

                <div className="float-right flex pb-4">
                    <Button onClick={() => onCancel && onCancel()} variant="secondary" className="mr-2">
                        {t('creators.cancel')}
                    </Button>
                    <Button onClick={() => handleUpdateClick(state)}>{t('profile.updateProfileButton')}</Button>
                </div>
            </div>
        </div>
    );
};
