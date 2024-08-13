import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import { AvatarWithFallback } from '../avatar/avatar-with-fallback';
import { imgProxy } from 'src/utils/fetcher';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import Link from 'next/link';
import { generateUrlIfTiktok } from 'src/utils/outreach/helpers';

export interface SequenceInfluencerTableNameProps {
    influencer: SequenceInfluencerEntity;
}

export default function SequenceInfluencerTableName({ influencer }: SequenceInfluencerTableNameProps) {
    const Icon = influencer.url?.includes('youtube')
        ? Youtube
        : influencer.url?.includes('tiktok')
        ? Tiktok
        : Instagram;

    return (
        <div className="border-bjustify-start inline-flex h-[60px] items-center gap-4 px-4 py-2">
            <div className="flex h-12 shrink grow basis-0 items-center justify-start gap-3">
                <div className="relative flex h-12 w-12 items-start justify-start gap-2.5 rounded-[999px]">
                    <AvatarWithFallback url={influencer.avatarUrl ? imgProxy(influencer.avatarUrl) : ''} />
                    <Icon className="absolute -bottom-0 -right-3 h-6 w-6" />
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center">
                    <div className="self-stretch font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-600">
                        {influencer.name}
                    </div>
                    <div className="self-stretch">
                        <span className="font-['Poppins'] text-xs font-medium leading-tight tracking-tight text-[#fda4cb]">
                            @
                        </span>
                        <Link
                            className="cursor-pointer font-['Poppins'] text-xs font-medium font-semibold leading-tight tracking-tight text-gray-500 text-gray-600"
                            href={generateUrlIfTiktok(influencer.url, influencer.username ?? '')}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {influencer.username ?? ''}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
