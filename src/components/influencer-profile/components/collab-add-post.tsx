import React, { useCallback, useState } from 'react';
import { Button } from 'src/components/button';
import { CollabAddPostModal } from './collab-add-post-modal';
import type { Profile } from './profile-header';

type Props = {
    profile: Profile;
};

export const CollabAddPost = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <>
            <label className="my-2 flex w-full flex-col text-sm text-gray-800">
                <div className="font-semibold">Posts</div>
                <Button onClick={handleClick}>Add Post</Button>
                {/* @note <TextInputComponent> has empty spans (probably for helper texts) but uses <p> tag which has margins */}
                <span>
                    <p className="text-xs">&nbsp;</p>
                </span>
            </label>

            <CollabAddPostModal profile={props.profile} isOpen={isModalOpen} onClose={handleClose} />
        </>
    );
};
