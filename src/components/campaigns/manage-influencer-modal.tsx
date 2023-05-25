import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { SocialMediaPlatform } from 'types';

import { SocialMediaIcon } from '../common/social-media-icon';

export interface ManageInfluencerModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
}

export const ManageInfluencerModal = ({ creator, ...props }: ManageInfluencerModalProps) => {
    const { t } = useTranslation();
    const handle = creator.username || creator.fullname || '';

    return (
        <Modal {...props} maxWidth="max-w-[900px]">
            <>
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
            </>
        </Modal>
    );
};
