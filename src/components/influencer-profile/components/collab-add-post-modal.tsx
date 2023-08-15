import { t } from 'i18next';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { SocialMediaIcon } from 'src/components/common/social-media-icon';
import { Modal } from 'src/components/modal';
import { useInfluencers } from 'src/hooks/use-influencers';
import type { SocialMediaPlatform } from 'types';
import type { PostUrl } from './collab-add-post-modal-form';
import { CollabAddPostModalForm } from './collab-add-post-modal-form';
import { InfluencerPosts } from './influencer-posts';
import type { Profile } from './profile-header';

type Props = Omit<
    {
        profile: Profile;
        isOpen?: boolean;
        onClose?: () => void;
    },
    'children'
>;

export const CollabAddPostModal = (props: Props) => {
    const { onClose } = { onClose: () => null, ...props };
    const { getPosts } = useInfluencers();

    useEffect(() => {
        // load posts when the modal is opened
        if (!props.isOpen || getPosts.isLoading !== null) return;

        // getPosts.call('your-influencer-id')
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [props.isOpen, getPosts]);

    const handleSaveUrls = useCallback((urls: PostUrl[]) => {
        // eslint-disable-next-line no-console
        console.log('saving', urls);
    }, []);

    return (
        <Modal {...props} onClose={onClose} visible={props.isOpen ?? false}>
            <div className="mb-10 flex justify-between">
                <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.post.title')}</h2>
                <div className="flex items-center">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                        <img
                            className="h-10 w-10 rounded-full"
                            // src={imgProxy(props.profile.avatar)}
                            src={props.profile.avatar}
                            alt="campaign-influencer-avatar"
                        />
                        <div className="absolute bottom-0 right-0 ">
                            <SocialMediaIcon
                                platform={props.profile.platform as SocialMediaPlatform}
                                width={16}
                                height={16}
                                className="opacity-80"
                            />
                        </div>
                    </div>

                    {/* @ts-ignore @todo */}
                    <Link href={props.profile.link_url || '#no-profile-platform-url'} target="_blank">
                        <div className="ml-4">
                            <div className="truncate text-xs font-medium text-gray-900">
                                {/* @ts-ignore @todo */}
                                {props.profile.fullname ?? 'no name'}
                            </div>
                            <div className="inline-block truncate text-xs text-primary-500">
                                @{props.profile.username}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-y-3 px-3">
                <h3>{t('campaigns.post.addPostUrl')}</h3>
                <CollabAddPostModalForm onSave={handleSaveUrls} />
            </div>

            <h3 className="mt-10 font-bold">{t('campaigns.post.currentPosts')}</h3>
            <div className="px-3">
                <InfluencerPosts isLoading={getPosts.isLoading} posts={getPosts.data ?? []} />
            </div>
        </Modal>
    );
};
