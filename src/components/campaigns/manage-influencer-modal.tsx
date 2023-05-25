import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { SocialMediaPlatform } from 'types';
import { ArrowRightOnRectangle, Trashcan } from '../icons';
import { SocialMediaIcon } from '../common/social-media-icon';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Button } from '../button';

export interface ManageInfluencerModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
    openMoveInfluencerModal: (e: MouseEvent<HTMLButtonElement>, creator: CampaignCreatorDB) => void;
    openNotes: (e: MouseEvent<HTMLButtonElement>, creator: CampaignCreatorDB) => void;
    deleteCampaignCreator: (e: MouseEvent<HTMLButtonElement>, creator: CampaignCreatorDB) => Promise<void>;
}

const validateNumberInput = (fee: string) => {
    // must be a number
    if (!fee) {
        return '';
    }
    if (isNaN(Number(fee))) {
        return 'Must be a number';
    }
};

const inputClass =
    'block w-full max-w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-gray-300 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-xs sm:text-xs';

const FormSection = ({ creator, ...props }: ManageInfluencerModalProps) => {
    const { t } = useTranslation();
    const { onClose } = props;

    const handleUpdateCampaignInfluencer = async () => {
        //
    };

    const [influencerFee, setInfluencerFee] = useState(creator.rate_cents?.toLocaleString());

    const submitDisabled = [influencerFee].some((field) => validateNumberInput(field));

    return (
        <form
            className="flex w-full flex-wrap gap-y-3"
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdateCampaignInfluencer();
            }}
        >
            <div className="flex w-full flex-col gap-y-3 px-3 sm:w-1/2">
                <div className="flex flex-col gap-y-3">
                    <label htmlFor="influencer-fee-input" className="text-sm font-bold">
                        {t('campaigns.manageInfluencer.influencerFee')}
                    </label>
                    <input
                        id="influencer-fee-input"
                        className={inputClass}
                        onChange={(e) => setInfluencerFee(e.target.value)}
                        value={influencerFee}
                    />
                    <p className="text-xs text-red-400">{validateNumberInput(influencerFee)}</p>
                </div>
                <div className="flex flex-col gap-y-3">
                    <label htmlFor="influencer-fee-input" className="text-sm font-bold">
                        {t('campaigns.manageInfluencer.influencerFee')}
                    </label>
                    <input
                        id="influencer-fee-input"
                        className={inputClass}
                        onChange={(e) => setInfluencerFee(e.target.value)}
                        value={influencerFee}
                    />
                    <p className="text-xs text-red-400">{validateNumberInput(influencerFee)}</p>
                </div>
            </div>
            <div className="flex w-full flex-col gap-y-3 px-3 sm:w-1/2">
                <div className="flex flex-col gap-y-3">
                    <label htmlFor="influencer-fee-input" className="text-sm font-bold">
                        {t('campaigns.manageInfluencer.sales')}
                    </label>
                    <input
                        id="influencer-fee-input"
                        className={inputClass}
                        onChange={(e) => setInfluencerFee(e.target.value)}
                        value={influencerFee}
                    />
                    <p className="text-xs text-red-400">{validateNumberInput(influencerFee)}</p>
                </div>
                <div className="flex flex-col gap-y-3">
                    <label htmlFor="influencer-fee-input" className="text-sm font-bold">
                        {t('campaigns.manageInfluencer.influencerFee')}
                    </label>
                    <input
                        id="influencer-fee-input"
                        className={inputClass}
                        onChange={(e) => setInfluencerFee(e.target.value)}
                        value={influencerFee}
                    />
                    <p className="text-xs text-red-400">{validateNumberInput(influencerFee)}</p>
                </div>
                <div className="ml-auto flex gap-x-3">
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose(false);
                        }}
                    >
                        {t('campaigns.manageInfluencer.cancel')}
                    </Button>
                    <Button disabled={submitDisabled} type="submit">
                        {t('campaigns.manageInfluencer.save')}
                    </Button>
                </div>
            </div>
        </form>
    );
};

const HeaderSection = ({ creator }: { creator: CampaignCreatorDB }) => {
    const { t } = useTranslation();
    const handle = creator.username || creator.fullname || '';

    return (
        <div className="mb-10 flex justify-between">
            <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.manageInfluencer.title')}</h2>
            <div className="flex items-center">
                <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                    <img className="h-10 w-10 rounded-full" src={imgProxy(creator.avatar_url)} alt="" />
                    <div className="absolute bottom-0 right-0 ">
                        <SocialMediaIcon
                            platform={creator.platform as SocialMediaPlatform}
                            width={16}
                            height={16}
                            className="opacity-80"
                        />
                    </div>
                </div>

                <Link href={creator.link_url || ''} target="_blank">
                    <div className="ml-4">
                        <div className="truncate text-xs font-medium text-gray-900">{creator.fullname}</div>
                        <div className="inline-block truncate text-xs text-primary-500">@{handle}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const smallButtonClass =
    'rounded-md border border-gray-200 bg-gray-100 p-1 text-xs font-medium text-gray-600 hover:bg-gray-200';

const SmallButtonsSection = ({
    creator,
    openNotes,
    openMoveInfluencerModal,
    deleteCampaignCreator,
}: ManageInfluencerModalProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="flex justify-end gap-x-2">
                <button
                    data-testid="show-influencer-notes"
                    onClick={(e) => openNotes(e, creator)}
                    className={smallButtonClass}
                >
                    {t('campaigns.show.notes')}
                </button>

                <button
                    data-testid="show-move-influencer"
                    onClick={(e) => openMoveInfluencerModal(e, creator)}
                    className={smallButtonClass}
                >
                    <ArrowRightOnRectangle className="h-4 w-4 stroke-tertiary-600 " />
                </button>

                <button
                    data-testid="delete-influencer"
                    onClick={(e) => deleteCampaignCreator(e, creator)}
                    className={smallButtonClass}
                >
                    <Trashcan className="h-4 w-4 fill-tertiary-600" />
                </button>
            </div>
        </div>
    );
};

export const ManageInfluencerModal = (props: ManageInfluencerModalProps) => {
    return (
        <Modal {...props} maxWidth="max-w-[900px]">
            <>
                <HeaderSection {...props} />
                <SmallButtonsSection {...props} />
                <FormSection {...props} />
            </>
        </Modal>
    );
};
