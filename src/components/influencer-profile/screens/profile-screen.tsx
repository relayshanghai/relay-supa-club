import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useCallback, useState } from 'react';
import type { ProfileNotes } from '../components/profile-notes-tab';
import { ProfileNotesTab } from '../components/profile-notes-tab';
import type { ProfileShippingDetails } from '../components/profile-shipping-details-tab';
import { ProfileShippingDetailsTab } from '../components/profile-shipping-details-tab';
import { Button } from 'src/components/button';
import { cls } from 'src/utils/classnames';
import type { Profile } from '../components/profile-header';
import { ProfileHeader } from '../components/profile-header';
import { useProfileScreenContext } from './profile-screen-context';

export type ProfileValue = {
    notes: ProfileNotes;
    shippingDetails: ProfileShippingDetails;
};

type Props = {
    profile: Profile;
    selectedTab?: 'notes' | 'shipping-details';
    onUpdate?: (data: ProfileValue) => void;
    onCancel?: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const activeTabStyles = cls(['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']);

export const ProfileScreen = ({ profile, selectedTab, onUpdate, onCancel, ...props }: Props) => {
    const { state, setState } = useProfileScreenContext();

    const [selected, setSelected] = useState(selectedTab ?? 'notes');

    const handleTabClick = (tab: Props['selectedTab']) => tab && setSelected(tab);

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
                return { ...state, notes: { ...state.notes, [k]: v } };
            });
        },
        [setState],
    );

    const handleUpdateClick = useCallback(
        (data: ProfileValue) => {
            onUpdate && onUpdate(data);
        },
        [onUpdate],
    );

    return (
        <div {...props}>
            <div className="mb-4 h-28">
                <ProfileHeader className="relative left-4 top-2" profile={profile} />
            </div>

            <nav className="flex space-x-2">
                <button
                    onClick={() => handleTabClick('notes')}
                    type="button"
                    className={`${
                        selected === 'notes' ? activeTabStyles : ''
                    } inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-400`}
                >
                    Notes
                </button>
                <button
                    onClick={() => handleTabClick('shipping-details')}
                    type="button"
                    className={`${
                        selected === 'shipping-details' ? activeTabStyles : ''
                    } inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-400`}
                >
                    Shipping Details
                </button>
            </nav>

            <div className="mt-3 p-12">
                <div className={`${selected !== 'notes' ? 'hidden' : ''}`}>
                    <ProfileNotesTab onUpdate={handleNotesDetailsUpdate} />
                </div>
                <div className={`${selected !== 'shipping-details' ? 'hidden' : ''}`}>
                    <ProfileShippingDetailsTab onUpdate={handleShippingUpdate} />
                </div>

                <div className="float-right flex">
                    <Button onClick={() => onCancel && onCancel()} variant="secondary" className="mr-2">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdateClick(state)}>Update Influencer Profile</Button>
                </div>
            </div>
        </div>
    );
};
