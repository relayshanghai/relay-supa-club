import type { SVGProps } from 'react';
import type { SocialMediaPlatform } from 'types';
import { Email, Facebook, Instagram, Tiktok, Twitter, Wechat, Youtube, Link } from '../icons';

export const SocialMediaIcon = ({
    platform,
    ...props
}: SVGProps<SVGSVGElement> & { platform: SocialMediaPlatform }) => {
    if (platform === 'youtube') return <Youtube {...props} />;
    if (platform === 'instagram') return <Instagram {...props} />;
    if (platform === 'tiktok') return <Tiktok {...props} />;
    if (platform === 'twitter') return <Twitter {...props} />;
    if (platform === 'facebook') return <Facebook {...props} />;
    if (platform === 'email') return <Email {...props} />;
    if (platform === 'wechat') return <Wechat {...props} />;
    return <Link {...props} />;
    return null;
};
