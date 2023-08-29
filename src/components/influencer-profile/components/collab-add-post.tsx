import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useState } from 'react';
import { Button } from 'src/components/button';
import { CollabAddPostModal } from './collab-add-post-modal';

type Props = {
    profile: SequenceInfluencerManagerPage;
    label: string;
    buttonText: string;
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
            <label className="my-2 flex w-full flex-col gap-2 text-sm text-gray-500">
                <div className="font-semibold">{props.label}</div>
                <Button className="w-fit" onClick={handleClick}>
                    {props.buttonText}
                </Button>
                {/* @note <TextInputComponent> has empty spans (probably for helper texts) but uses <p> tag which has margins */}
                <span>
                    <p className="text-xs">&nbsp;</p>
                </span>
            </label>

            <CollabAddPostModal profile={props.profile} isOpen={isModalOpen} onClose={handleClose} />
        </>
    );
};
