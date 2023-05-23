import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { SocialMediaPlatform } from 'types';

import { SocialMediaIcon } from '../common/social-media-icon';
import { useState } from 'react';

import { Button } from '../button';
import { toast } from 'react-hot-toast';

export interface AddPostModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
}
type PostInfo = {
    title: string;
    description: string;
    postedDate: string;
};
// expected url patterns:
// Instagram https://www.instagram.com/relay.club/?hl=en
// YouTube https://www.youtube.com/channel/UClf-gnZdtIffbPPhOq3CelA
// YouTube https://youtu.be/channel/UClf-gnZdtIffbPPhOq3CelA
// TikTok https://vm.tiktok.com/ZSd2GkJrM/

// regex must be a valid url starting with http:///https://
// must include instagram.com, youtube.com, youtu.be, or tiktok.com
const urlRegex =
    /^(https?:\/\/)(www\.)?(instagram\.com|youtube\.com|youtu\.be|tiktok\.com|vm.tiktok.com)(\/[\w\-]{3,})+/;

export const AddPostModal = ({ creator, ...props }: AddPostModalProps) => {
    const { t } = useTranslation();
    const handle = creator.username || creator.fullname || '';
    const [urls, setUrls] = useState<{ [key: string]: string }>({ 'url-0': '' });
    const [_addedUrls, setAddedUrls] = useState<PostInfo[]>([]);

    const handleAddAnotherPost = () => {
        setUrls((prev) => {
            const length = Object.keys(prev).length;
            return {
                ...prev,
                [`url-${length}`]: '',
            };
        });
    };
    const validateUrl = (url: string, _urls: typeof urls) => {
        if (!url) {
            return '';
        }
        if (!urlRegex.test(url)) {
            // return t('campaigns.post.invalidUrl');
        }
        if (Object.values(_urls).filter((u) => u === url).length > 1) {
            return t('campaigns.post.duplicateUrl');
        }
        return '';
    };

    const backendCallStub = async (_url: string): Promise<PostInfo> => {
        return {
            title: 'title',
            description: 'description',
            postedDate: new Date().toISOString(),
        };
    };
    const scrapeByUrl = async (_urls: typeof urls) => {
        const successful: PostInfo[] = [];
        const failed: typeof urls = {};
        for (const [key, url] of Object.entries(_urls)) {
            if (validateUrl(url, _urls) !== '') {
                failed[key] = _urls[key];
                continue;
            }
            try {
                const postInfo = await backendCallStub(url);
                if (postInfo) {
                    successful.push(postInfo);
                }
            } catch (error) {
                failed[key] = _urls[key];
            }
        }
        return { successful, failed };
    };

    const handleSubmit = async (_urls: typeof urls) => {
        const { successful, failed } = await scrapeByUrl(_urls);
        setAddedUrls((prev) => [...prev, ...successful]);
        setUrls(failed); // will set the form to 0 if no errors, or keep the failed urls in the form if there are errors
        if (Object.keys.length === 0) {
            toast.success(t('campaigns.post.success'));
        } else {
            toast.error(t('campaigns.post.error', { amount: Object.keys(failed).length }));
        }
    };

    const hasError = Object.values(urls).some((url) => validateUrl(url, urls) !== '');
    const submitDisabled = hasError;
    return (
        <Modal {...props}>
            <div className="mb-10 flex justify-between">
                <h2 className="text-xl font-semibold text-gray-700">{t('campaigns.post.title')}</h2>
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

            <form
                className="flex flex-col gap-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(urls);
                }}
            >
                <h3>{t('campaigns.post.addPostUrl')}</h3>
                {Object.values(urls).map((url, index) => {
                    const error = validateUrl(url, urls);
                    return (
                        <div key={`url-${index}`}>
                            <input
                                className="my-2 block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-xs"
                                onChange={(e) => {
                                    setUrls((prev) => ({
                                        ...prev,
                                        [`url-${index}`]: e.target.value,
                                    }));
                                }}
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
                        {t('campaigns.post.submit')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
