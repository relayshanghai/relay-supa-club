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

export type ProfileValue = {
    notes: ProfileNotes;
    shippingDetails: ProfileShippingDetails;
};

type Props = {
    profile: Profile;
    value?: ProfileValue;
    selectedTab?: 'notes' | 'shipping-details';
    onUpdate?: (data: Partial<ProfileValue>) => void;
    onCancel?: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const activeTabStyles = cls(['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']);

export const ProfileScreen = ({ profile, value, selectedTab, onUpdate, onCancel, ...props }: Props) => {
    const [selected, setSelected] = useState(selectedTab ?? 'notes');

    const handleTabClick = (tab: Props['selectedTab']) => tab && setSelected(tab);

    const [data, setData] = useState<Partial<ProfileValue>>(() => {
        return value ?? { notes: undefined, shippingDetails: undefined };
    });

    const handleNotesDetailsUpdate = useCallback((data: ProfileNotes) => {
        setData((state) => {
            return { ...state, notes: data };
        });
    }, []);

    const handleshippingUpdate = useCallback((data: ProfileShippingDetails) => {
        setData((state) => {
            return { ...state, shippingDetails: data };
        });
    }, []);

    const handleUpdateClick = useCallback(
        (data: Partial<ProfileValue>) => {
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
                    <ProfileNotesTab onUpdate={handleNotesDetailsUpdate} value={data.notes} />
                </div>
                <div className={`${selected !== 'shipping-details' ? 'hidden' : ''}`}>
                    <ProfileShippingDetailsTab onUpdate={handleshippingUpdate} value={data.shippingDetails} />
                </div>

                <div className="float-right flex">
                    <Button onClick={() => onCancel && onCancel()} variant="secondary" className="mr-2">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdateClick(data)}>Update Influencer Profile</Button>
                </div>
            </div>
        </div>
    );
};
