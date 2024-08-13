import type { SequenceInfluencerEntity } from "src/backend/database/sequence/sequence-influencer-entity";
import { AvatarWithFallback } from "../avatar/avatar-with-fallback";
import { imgProxy } from "src/utils/fetcher";
import { Instagram, Tiktok, Youtube } from "src/components/icons";
import Link from "next/link";
import { generateUrlIfTiktok } from "src/utils/outreach/helpers";

export interface SequenceInfluencerTableNameProps {
    influencer: SequenceInfluencerEntity;
}

export default function SequenceInfluencerTableName({
    influencer
}: SequenceInfluencerTableNameProps) {

    const Icon = influencer.url?.includes('youtube')
        ? Youtube
        : influencer.url?.includes('tiktok')
        ? Tiktok
        : Instagram;

    return <div className="h-[60px] px-4 py-2 border-bjustify-start items-center gap-4 inline-flex">
    <div className="grow shrink basis-0 h-12 justify-start items-center gap-3 flex">
      <div className="w-12 h-12 relative rounded-[999px] justify-start items-start gap-2.5 flex">
        <AvatarWithFallback
            url={influencer.avatarUrl ? imgProxy(influencer.avatarUrl) : ''}
        />
      <Icon className="absolute -bottom-0 -right-3 h-6 w-6" />
      </div>
      <div className="grow shrink basis-0 flex-col justify-center items-start inline-flex">
        <div className="self-stretch text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{ influencer.name }</div>
        <div className="self-stretch">
          <span className="text-[#fda4cb] text-xs font-medium font-['Poppins'] leading-tight tracking-tight">@</span>
        <Link
                                className="cursor-pointer text-gray-600 text-xs font-medium font-['Poppins'] leading-tight tracking-tight font-semibold text-gray-500"
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
  
}