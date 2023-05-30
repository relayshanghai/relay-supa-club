import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy, nextFetch } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { SocialMediaIcon } from '../common/social-media-icon';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../button';
import { toast } from 'react-hot-toast';
import { Spinner, Trashcan } from '../icons';
import type { InfluencerPostRequestBody, InfluencerPostResponse } from 'pages/api/influencer/posts';
import { clientLogger } from 'src/utils/logger-client';
import { ulid } from 'ulid';
import { useRudderstack } from 'src/hooks/use-rudderstack';

export interface AddPostModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
}
export type PostInfo = {
    title: string;
    postedDate: string;
    id: string;
    url: string;
};
// expected url patterns:
// Instagram https://www.instagram.com/p/Cr3aeZ7NXW3/
// YouTube https://www.youtube.com/watch?v=UzL-0vZ5-wk
// YouTube shortened https://youtu.be/UzL-0vZ5-wk
// TikTok https://www.tiktok.com/@graceofearth/video/7230816093755936043?_r=1&_t=8c9DNKVO2Tm&social_sharing=v2
// TikTok M https://vm.tiktok.com/@graceofearth/video/7230816093755936043
// TikTok T https://vt.tiktok.com/@graceofearth/video/7230816093755936043?is_from_webapp=1&sender_device=pc&web_id=7214153327838512682

// regex must be a valid url starting with http:///https://
// must include instagram.com, youtube.com, youtu.be, or tiktok.com
function isValidUrl(url: string): boolean {
    let regex: RegExp;
    if (url.includes('instagram')) {
        regex = /^(https?:\/\/)(www\.)?instagram\.com\/p\/[\w\-]+\/?/;
    } else if (url.includes('youtube') || url.includes('youtu.be')) {
        regex = /^(https?:\/\/)(www\.)?(youtu\.be\/[\w\-]+|youtube\.com\/watch\?v=[\w\-]+)\/?/;
    } else if (url.includes('tiktok')) {
        regex =
            /^(https?:\/\/)(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/(@[\w\-]+\/video\/[\w\-]+)(\/|\?.*)?$/;
    } else {
        return false;
    }
    return regex.test(url);
}
export const AddPostModal = ({ creator, ...props }: AddPostModalProps) => {
    const { t, i18n } = useTranslation();
    const handle = creator.username || creator.fullname || '';
    const [urls, setUrls] = useState<{ [key: string]: string }>({ [ulid()]: '' });
    const [addedUrls, setAddedUrls] = useState<PostInfo[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [checkingAddedUrls, setCheckingAddedUrls] = useState(false);
    const { trackEvent } = useRudderstack();
    const getAddedUrls = useCallback(async () => {
        try {
            setCheckingAddedUrls(true);
            const urls = await nextFetch<PostInfo[]>(`influencer/${encodeURIComponent(creator.id)}/posts`);
            setAddedUrls(urls);
        } catch (error) {
            clientLogger(error, 'error');
        } finally {
            setCheckingAddedUrls(false);
        }
    }, [creator.id]);

    useEffect(() => {
        setAddedUrls([]); // reset on reopen
        setUrls({ [ulid()]: '' });
        getAddedUrls();
    }, [getAddedUrls, props.visible]);

    const handleAddAnotherPost = () => {
        setUrls((prev) => {
            return { ...prev, [ulid()]: '' };
        });
        trackEvent('Manage Posts Modal, add another post', { urls });
    };

    const validateUrl = (url: string, _urls: typeof urls) => {
        if (!url) {
            return '';
        }
        if (!isValidUrl(url)) {
            return t('campaigns.post.invalidUrl');
        }
        if (Object.values(_urls).filter((u) => u === url).length > 1) {
            return t('campaigns.post.duplicateUrl');
        }
        //check for duplicates in the already added ones as well
        if (addedUrls.filter((u) => u.url === url).length > 0) {
            return t('campaigns.post.duplicateUrl');
        }
        return '';
    };

    const scrapeByUrls = async (_urls: typeof urls): Promise<{ successful: PostInfo[]; failed: typeof urls }> => {
        const successful: PostInfo[] = [];
        let failed: typeof urls = _urls;
        if (!creator.campaign_id) {
            return { successful, failed };
        }
        try {
            const body: InfluencerPostRequestBody = {
                campaign_id: creator.campaign_id,
                urls: Object.values(_urls),
                creator_id: creator.id,
            };
            const res = await nextFetch<InfluencerPostResponse>('influencer/posts', {
                method: 'POST',
                body,
            });
            if (!res) {
                return { successful, failed };
            }
            if ('error' in res) {
                return { successful, failed };
            }
            successful.push(...res.successful);
            failed = Object.fromEntries(res.failed.map((failUrl) => [ulid(), failUrl]));
        } catch (e) {
            clientLogger(e, 'error');
        }
        return { successful, failed };
    };

    const handleSubmit = async (_urls: typeof urls) => {
        setSubmitting(true);
        const { successful, failed } = await scrapeByUrls(_urls);

        setAddedUrls((prev) => [...prev, ...successful]);

        // will set the form to 0 if no errors, or keep the failed urls in the form if there are errors
        if (Object.keys(failed).length === 0) {
            toast.success(t('campaigns.post.success', { amount: successful.length }));
            trackEvent('Manage Posts Modal, submit', { amount: successful.length });
            setUrls({ [ulid()]: '' });
        } else {
            toast.error(t('campaigns.post.failed', { amount: Object.keys(failed).length }));
            setUrls(failed);
        }
        setSubmitting(false);
    };

    const handleRemovePost = async (postId: string) => {
        try {
            toast.success(t('campaigns.post.removedPost'));
            await nextFetch<PostInfo[]>(`influencer/posts/${encodeURIComponent(postId)}`, { method: 'DELETE' });
            trackEvent('Manage Posts Modal, remove post');
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('campaigns.post.errorRemovingPost'));
        }
        setAddedUrls(() => addedUrls.filter((url) => url.id !== postId));
    };

    const hasError = Object.values(urls).some((url) => validateUrl(url, urls) !== '');
    const submitDisabled = hasError || submitting;

    return (
        <Modal {...props}>
            <>
                <div className="mb-10 flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.post.title')}</h2>
                    <div className="flex items-center">
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={imgProxy(creator.avatar_url)}
                                alt="campaign-influencer-avatar"
                            />
                            <div className="absolute bottom-0 right-0 ">
                                <SocialMediaIcon
                                    platform={creator.platform}
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
                <form
                    className="flex flex-col gap-y-3 px-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(urls);
                    }}
                >
                    <h3>{t('campaigns.post.addPostUrl')}</h3>
                    {Object.entries(urls).map(([key, url]) => {
                        const error = validateUrl(url, urls);
                        return (
                            // Using an 'unsafe' index as key here, but it's fine because we reset the form when we remove an input
                            <div key={key} className="my-2 flex flex-col gap-y-2">
                                <input
                                    className="block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-gray-300 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-xs"
                                    onChange={(e) => {
                                        const newUrls = { ...urls };
                                        newUrls[key] = e.target.value.trim();
                                        setUrls(newUrls);
                                    }}
                                    value={url}
                                />
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        );
                    })}

                    <div className="ml-auto flex gap-x-3">
                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddAnotherPost();
                            }}
                        >
                            {t('campaigns.post.addAnotherPost')}
                        </Button>
                        <Button disabled={submitDisabled} type="submit">
                            {submitting ? (
                                <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                            ) : (
                                t('campaigns.post.submit')
                            )}
                        </Button>
                    </div>
                </form>

                <h3 className="mt-10 font-bold">{t('campaigns.post.currentPosts')}</h3>
                <div className="px-3">
                    {addedUrls.length > 0 ? (
                        <>
                            {addedUrls.map((post) => (
                                <div key={post.id} className="my-3 flex justify-between">
                                    <Link
                                        className="w-fit gap-x-3"
                                        href={post.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h4 className="text-sm line-clamp-1">{post.title}</h4>
                                        <p className="text-sm font-light text-gray-400">
                                            {new Intl.DateTimeFormat(i18n.language, {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'UTC',
                                            }).format(new Date(post.postedDate))}
                                        </p>
                                    </Link>
                                    <button
                                        data-testid="delete-creator"
                                        onClick={() => handleRemovePost(post.id)}
                                        className="rounded-md border border-gray-200 bg-gray-100 p-2 text-center text-gray-800 outline-none hover:bg-gray-200"
                                    >
                                        <Trashcan className="h-4 w-4 fill-tertiary-600 hover:fill-primary-600" />
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : checkingAddedUrls ? (
                        <Spinner className="mx-auto my-5 h-5 w-5 fill-gray-600 text-white" />
                    ) : (
                        <div className="my-5 h-5" />
                    )}
                </div>
            </>
        </Modal>
    );
};
