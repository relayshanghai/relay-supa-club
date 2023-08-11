import { useCallback, useState, useEffect } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { useAsync } from 'src/hooks/use-async';
import { apiFetch } from 'src/utils/api/api-fetch';

type Props = {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

export const ProfileOverlayScreen = (props: Props) => {
    const [profile] = useState({
        username: 'TastyChef',
        platform: 'instagram',
        name: "D'Jon Curtis",
        avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=TastyChef&size=96',
    });

    // @todo pass down the state? or use contexts?
    const [value, setValue] = useState<ProfileValue>({
        notes: {
            collabStatus: '',
            nextStep: '',
            fee: '',
            videoDetails: '',
            affiliateLink: '',
            scheduledPostDate: '',
            notes: '',
        },
        shippingDetails: {
            name: '',
            phoneNumber: '',
            streetAddress: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            trackingCode: '',
            fullAddress: '',
        },
    });

    const getNotes = useAsync(async (id: string, author: string) => {
        return await apiFetch('/api/notes/influencer/{id}', { path: { id }, query: { author } });
    });

    useEffect(() => {
        // load posts when the modal is opened
        if (!props.isOpen || getNotes.isLoading !== null) return;

        getNotes.call('0da5c793-04ac-4eb4-8c2d-d0ee1b55e009', '2cf901f7-15ec-4734-b50c-8dd3430a1e55').then((notes) => {
            const _notes = notes[0] ?? { comment: '' };

            setValue((s) => {
                return { ...s, notes: { ...s.notes, notes: _notes.comment } };
            });
        });
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [props.isOpen, getNotes]);

    const handleClose = useCallback(() => {
        props.onClose && props.onClose();

        // eslint-disable-next-line no-console
        console.log('overlay closed!');
    }, [props]);

    const handleOpen = useCallback(() => {
        props.onOpen && props.onOpen();

        // eslint-disable-next-line no-console
        console.log('overlay opened!');
    }, [props]);

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            props.onUpdate && props.onUpdate(data);
            handleClose();

            // eslint-disable-next-line no-console
            console.log('overlay update!');
        },
        [props, handleClose],
    );

    return (
        <>
            <OverlayRight isOpen={props.isOpen} onClose={handleClose} onOpen={handleOpen}>
                <ProfileScreen profile={profile} value={value} onCancel={handleClose} onUpdate={handleUpdate} />
            </OverlayRight>
        </>
    );
};
