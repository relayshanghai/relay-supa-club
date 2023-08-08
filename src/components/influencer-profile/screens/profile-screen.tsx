import { useCallback, useMemo, useState } from 'react';
import type { ProfileNotesDetails } from '../components/profile-notes-tab';
import { ProfileNotesTab } from '../components/profile-notes-tab';
import type { ProfileShippingDetails } from '../components/profile-shipping-details-tab';
import { ProfileShippingDetailsTab } from '../components/profile-shipping-details-tab';
import { Button } from 'src/components/button';
import { cls } from 'src/utils/classnames';

type Props = {
    selected?: 'notes' | 'shipping-details';
};

export const ProfileScreen = (props: Props) => {
    const [selected, setSelected] = useState(props.selected ?? 'notes');

    const handleTabClick = (tab: Props['selected']) => tab && setSelected(tab);

    const notesTabCls = useMemo(
        () =>
            cls(() =>
                selected === 'notes' ? ['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500'] : '',
            ),
        [selected],
    );
    const shippingDetailsTabCls = useMemo(
        () =>
            cls(() =>
                selected === 'shipping-details'
                    ? ['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']
                    : '',
            ),
        [selected],
    );
    const notesTabContentCls = useMemo(() => cls({ hidden: selected !== 'notes' }), [selected]);
    const shippingDetailsTabContentCls = useMemo(() => cls({ hidden: selected !== 'shipping-details' }), [selected]);

    const [shippingDetailsValue] = useState<Partial<ProfileShippingDetails>>({
        name: 'Jacob',
    });

    const handleNotesDetailsUpdate = useCallback((data: ProfileNotesDetails) => {
        // eslint-disable-next-line no-console
        console.log(data);
    }, []);

    const handleShippingDetailsUpdate = useCallback((data: ProfileShippingDetails) => {
        // eslint-disable-next-line no-console
        console.log(data);
    }, []);

    return (
        <>
            <nav className="flex space-x-2">
                <button
                    onClick={() => handleTabClick('notes')}
                    type="button"
                    className={`${notesTabCls} inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-400`}
                >
                    Notes
                </button>
                <button
                    onClick={() => handleTabClick('shipping-details')}
                    type="button"
                    className={`${shippingDetailsTabCls} inline-flex grow basis-0 items-center justify-center gap-2 bg-transparent px-4 py-3 text-center text-center text-sm font-medium text-gray-400`}
                >
                    Shipping Details
                </button>
            </nav>

            <div className="mt-3 p-12">
                <div className={notesTabContentCls}>
                    <ProfileNotesTab onUpdate={handleNotesDetailsUpdate} />
                </div>
                <div className={`${shippingDetailsTabContentCls}`}>
                    <ProfileShippingDetailsTab
                        onUpdate={handleShippingDetailsUpdate}
                        value={{ ...shippingDetailsValue }}
                    />
                </div>

                <div className="float-right flex">
                    <Button variant="secondary" className="mr-2">
                        Cancel
                    </Button>
                    <Button>Update Influencer Profile</Button>
                </div>
            </div>
        </>
    );
};
