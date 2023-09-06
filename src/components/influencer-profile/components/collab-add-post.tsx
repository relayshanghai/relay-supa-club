import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useState } from 'react';
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
            <label className="my-2 flex w-full flex-col items-start gap-2 text-sm text-gray-500">
                <div className="font-semibold">{props.label}</div>
                <button
                    onClick={handleClick}
                    className="group text-center text-sm font-medium leading-tight tracking-tight text-violet-500"
                >
                    <div className="inline-flex items-center justify-center gap-1 rounded-md border border-violet-500 px-4 py-2 group-disabled:border-slate-300 group-disabled:bg-slate-200 group-disabled:text-slate-300">
                        {props.buttonText}
                    </div>
                </button>
                {/* @note <TextInputComponent> has empty spans (probably for helper texts) but uses <p> tag which has margins */}
                <span>
                    <p className="text-xs">&nbsp;</p>
                </span>
            </label>

            <CollabAddPostModal profile={props.profile} isOpen={isModalOpen} onClose={handleClose} />
        </>
    );
};
