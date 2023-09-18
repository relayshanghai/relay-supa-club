import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { useState } from 'react';
import { InfluencerAlreadyAddedSequenceModal } from '../influencer-already-added-sequence-modal';
import type { AllSequenceInfluencersIqDataIdsAndSequenceNames } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import type { CreatorAccount, CreatorPlatform } from 'types';
import { AddToSequenceModal } from '../modal-add-to-sequence';

export interface AddToSequenceButtonProps {
    inMenu?: boolean;
    active?: boolean;
    allSequenceInfluencersIqDataIdsAndSequenceNames: AllSequenceInfluencersIqDataIdsAndSequenceNames[];
    creatorProfile: CreatorAccount;
    platform: CreatorPlatform;
    setShowMenu?: (show: boolean) => void;
}

export const AddToSequenceButton = ({
    inMenu,
    active,
    allSequenceInfluencersIqDataIdsAndSequenceNames,
    creatorProfile,
    platform,
    setShowMenu,
}: AddToSequenceButtonProps) => {
    const { t } = useTranslation();
    const [showAlreadyAddedSequenceModal, setShowAlreadyAddedSequenceModal] = useState(false);
    const [showAddToSequenceModal, setShowAddToSequenceModal] = useState(false);

    const alreadyAddedSequence = allSequenceInfluencersIqDataIdsAndSequenceNames?.find(
        ({ iqdata_id }) => iqdata_id === creatorProfile.user_id,
    );
    const addToSequence = () => {
        if (alreadyAddedSequence) {
            setShowAlreadyAddedSequenceModal(true);
        } else {
            setShowAddToSequenceModal(true);
        }
    };
    return (
        <>
            {inMenu ? (
                <button
                    className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                    onClick={addToSequence}
                >
                    {t('creators.addToSequence')}
                </button>
            ) : (
                <Button onClick={addToSequence} className="flex items-center gap-1">
                    <PlusCircleIcon className="w-5" />
                    <span className="">{t('creators.addToSequence')}</span>
                </Button>
            )}
            {showAlreadyAddedSequenceModal && (
                <InfluencerAlreadyAddedSequenceModal
                    visible={showAlreadyAddedSequenceModal}
                    onClose={() => {
                        if (setShowMenu) {
                            setShowMenu(false);
                        }
                        setShowAlreadyAddedSequenceModal(false);
                    }}
                    alreadyAddedSequence={alreadyAddedSequence?.sequenceName || ''}
                />
            )}
            <AddToSequenceModal
                show={showAddToSequenceModal}
                setShow={(show) => {
                    if (setShowMenu) {
                        setShowMenu(show);
                    }
                    setShowAddToSequenceModal(show);
                }}
                creatorProfile={creatorProfile}
                platform={platform}
            />
        </>
    );
};
