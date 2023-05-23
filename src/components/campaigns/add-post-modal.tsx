import { useTranslation } from 'react-i18next';
import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import Link from 'next/link';
import { imgProxy } from 'src/utils/fetcher';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { SocialMediaPlatform } from 'types';

import { SocialMediaIcon } from '../common/social-media-icon';
import { useCallback, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import { Button } from '../button';

export interface AddPostModalProps extends Omit<ModalProps, 'children'> {
    creator: CampaignCreatorDB;
}

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
            return t('campaigns.post.invalidUrl');
        }
        if (Object.values(_urls).filter((u) => u === url).length > 1) {
            return t('campaigns.post.duplicateUrl');
        }
        return '';
    };

    const handleSubmit = useCallback(async () => {
        // todo: send to backend
        clientLogger({ urls });
    }, [urls]);

    const hasError = Object.values(urls).some((url) => validateUrl(url, urls) !== '');
    const submitDisabled = hasError;
    return (
        <Modal {...props}>
            <div className="flex justify-between">
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
            <div>
                <h3>{t('campaigns.post.addPostUrl')}</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {Object.values(urls).map((url, index) => {
                        const error = validateUrl(url, urls);
                        return (
                            <div key={`url-${index}`}>
                                <input
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
                </form>
            </div>
        </Modal>
    );
};
