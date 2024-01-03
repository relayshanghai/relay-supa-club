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
}: {
    url: string;
    name?: string | null;
    size?: number;
    retries?: number;
    className?: string;
}) => {
    const [avatarError, setAvatarError] = useState(0);

    return (
        <>
            {url && avatarError <= retries ? (
                <Image
                    key={avatarError}
                    className={`inline-block bg-slate-300 ${className}`}
                    onError={() => setAvatarError(avatarError + 1)}
                    src={imgProxy(url) ?? ''}
                    alt={`Influencer avatar ${name ?? url}`}
                    height={size}
                    width={size}
                />
            ) : (
                <AvatarDefault height={size} width={size} className={`inline-block bg-slate-300 ${className}`} />
            )}
        </>
    );
};
