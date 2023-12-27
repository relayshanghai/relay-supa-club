import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { AvatarDefault } from '../icons';
import { imgProxy } from 'src/utils/fetcher';
import Image from 'next/image';
import { useState } from 'react';

export const InfluencerAvatarWithFallback = ({
    influencer,
    size = 56,
    retries = 7, // found this to be a reasonable number of retries. Ones that failed after this many tries were not going to work
}: {
    influencer: SequenceInfluencerManagerPage;
    size?: number;
    retries?: number;
}) => {
    const [avatarError, setAvatarError] = useState(0);

    return (
        <>
            {influencer.avatar_url && avatarError <= retries ? (
                <Image
                    key={avatarError}
                    className="inline-block h-14 w-14 bg-slate-300"
                    onError={() => setAvatarError(avatarError + 1)}
                    src={imgProxy(influencer.avatar_url) ?? ''}
                    alt={`Influencer avatar ${influencer.name}`}
                    height={size}
                    width={size}
                />
            ) : (
                <AvatarDefault height={size} width={size} />
            )}
        </>
    );
};
