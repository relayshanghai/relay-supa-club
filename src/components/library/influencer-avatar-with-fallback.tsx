import { AvatarDefault } from '../icons';
import { imgProxy } from 'src/utils/fetcher';
import Image from 'next/image';
import { useState } from 'react';

export const InfluencerAvatarWithFallback = ({
    url,
    name,
    size = 56,
    retries = 7, // found this to be a reasonable number of retries. Ones that failed after this many tries were not going to work
    className,
    bordered = false,
}: {
    url?: string | null;
    name?: string | null;
    size?: number;
    retries?: number;
    className?: string;
    bordered?: boolean;
}) => {
    const [avatarError, setAvatarError] = useState(0);

    return (
        <div className={`flex-none rounded-full ${bordered && 'border-8 border-white shadow-lg'}`}>
            {url && avatarError <= retries ? (
                <Image
                    data-testid={`influencer-avatar-${name}`}
                    key={avatarError}
                    className={`inline-block bg-slate-300 ${className} aspect-square rounded-full`}
                    onError={() => setAvatarError(avatarError + 1)}
                    src={imgProxy(url) ?? ''}
                    alt={`Influencer avatar ${name ?? url}`}
                    height={size}
                    width={size}
                />
            ) : (
                <AvatarDefault
                    data-testid={`influencer-avatar-${name}`}
                    height={size}
                    width={size}
                    className={`inline-block aspect-square rounded-full bg-slate-300 ${className}`}
                />
            )}
        </div>
    );
};
