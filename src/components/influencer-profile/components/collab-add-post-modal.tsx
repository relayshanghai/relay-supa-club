import { t } from 'i18next';
import Link from 'next/link';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect } from 'react';
import { SocialMediaIcon } from 'src/components/common/social-media-icon';
import { Modal } from 'src/components/modal';
import { useInfluencers } from 'src/hooks/use-influencers';
import { imgProxy } from 'src/utils/fetcher';
import type { SocialMediaPlatform } from 'types';
import { CollabAddPostModalForm } from './collab-add-post-modal-form';
import { InfluencerPosts } from './influencer-posts';
import type { PostUrl } from 'pages/api/influencer/[id]/posts-by-influencer';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { AddInfluencerPost } from 'src/utils/analytics/events';

type Props = Omit<
    {
        profile: SequenceInfluencerManagerPage;
        isOpen?: boolean;
        onClose?: () => void;
    },
    'children'
>;

export const CollabAddPostModal = ({ profile, ...props }: Props) => {
    const { onClose } = { onClose: () => null, ...props };
    const { getPosts, savePosts } = useInfluencers();
    const { track } = useRudderstackTrack();

    useEffect(() => {
        // load posts when the modal is opened
        if (!props.isOpen || getPosts.isLoading !== null) return;

        getPosts.call(profile.id);
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [props.isOpen, getPosts, profile]);

    const handleSaveUrls = useCallback(
        async (urls: PostUrl[], setUrls: (urls: PostUrl[]) => void) => {
            if (!profile.influencer_social_profile_id) {
                throw new Error('Influencer social profile id not found');
            }
            const res = await savePosts.call(profile.id, urls);
            savePosts.refresh();
            getPosts.refresh().call(profile.id);

            if (res.failed.length > 0) {
                setUrls(res.failed);
            }

            track(AddInfluencerPost, {
                influencer_id: profile.influencer_social_profile_id,
                platform: profile.platform,
                post_links: urls.slice(urls.length - (getPosts.data?.length ?? 0)).map((url) => url.value),
                total_profile_posts: urls.length,
            });
        },
        [savePosts, getPosts, profile, track],
    );

    const handleModalClose = useCallback(() => {
        getPosts.refresh();
        onClose();
    }, [getPosts, onClose]);

    return (
        <Modal {...props} onClose={handleModalClose} visible={props.isOpen ?? false}>
            <div className="mb-10 flex justify-between">
                <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.post.title')}</h2>
                <div className="flex items-center">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                        <img
                            className="h-10 w-10 rounded-full"
                            src={
                                profile.avatar_url
                                    ? imgProxy(profile.avatar_url)
                                    : `https://api.dicebear.com/6.x/open-peeps/svg?seed=${profile.username}&size=96`
                            }
                            alt="campaign-influencer-avatar"
                        />
                        <div className="absolute bottom-0 right-0 ">
                            <SocialMediaIcon
                                platform={profile.platform as SocialMediaPlatform}
                                width={16}
                                height={16}
                                className="opacity-80"
                            />
                        </div>
                    </div>

                    <Link href={profile.url || '#no-profile-platform-url'} target="_blank">
                        <div className="ml-4">
                            <div className="truncate text-xs font-medium text-gray-900">
                                {profile.name ?? 'no name'}
                            </div>
                            <div className="inline-block truncate text-xs text-primary-500">@{profile.username}</div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-y-3 px-3">
                <h3>{t('campaigns.post.addPostUrl')}</h3>
                <CollabAddPostModalForm onSave={handleSaveUrls} isLoading={savePosts.isLoading} />
            </div>

            <h3 className="mt-10 font-bold">{t('campaigns.post.currentPosts')}</h3>
            <div className="px-3">
                <InfluencerPosts isLoading={getPosts.isLoading} posts={getPosts.data ?? []} />
            </div>
        </Modal>
    );
};
