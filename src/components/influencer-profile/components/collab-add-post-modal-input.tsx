import { t } from 'i18next';
import { useState } from 'react';
import type { PostUrl } from 'pages/api/influencer/[id]/posts-by-influencer';

function isValidUrl(url: string): boolean {
    if (!url) return true;

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

type Props = {
    url: PostUrl;
    onUpdate?: (value: PostUrl) => void;
};

export const CollabAddPostModalInput = (props: Props) => {
    const [value, setValue] = useState(props.url.value);

    return (
        <>
            <input
                type="text"
                className="block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-gray-300 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-xs"
                onInput={(e) => {
                    const value = e.currentTarget.value.trim();

                    // don't trigger update if it's the same value
                    if (value === props.url.value) return;

                    const error = !isValidUrl(value) ? t('campaigns.post.invalidUrl') : null;

                    if (props.onUpdate) {
                        props.onUpdate({ ...props.url, value, error });
                    }
                }}
                onChange={(e) => setValue(e.currentTarget.value)}
                value={value}
            />
            {props.url.error && <p className="text-xs text-red-400">{props.url.error}</p>}
        </>
    );
};
