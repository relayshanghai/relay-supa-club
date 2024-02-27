import type { Row, Table } from '@tanstack/react-table';
import Link from 'next/link';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSocialProfile } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { InfluencerAvatarWithFallback } from 'src/components/library/influencer-avatar-with-fallback';
import { useAtomValue } from 'jotai';
import { boostbotSearchIdAtom } from 'src/atoms/boostbot';

export type BoostbotAccountCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

export const BoostbotAccountCell = ({ row, table }: BoostbotAccountCellProps) => {
    const influencer = row.original;
    const { username, custom_name, fullname, url = '', picture, user_id } = influencer;
    const handle = username || custom_name || fullname || '';
    const Icon = url.includes('youtube') ? Youtube : url.includes('tiktok') ? Tiktok : Instagram;
    const { track } = useRudderstackTrack();
    const searchId = useAtomValue(boostbotSearchIdAtom);

    const isLoading = table.options.meta?.isLoading;
    // @note get platform from url for now
    //       `influencer` was supposed to be `UserProfile` type which contains `type` for platform but it's not there on runtime
    const platform = url.includes('youtube') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';

    return (
        <div className="flex max-w-[240px] items-center gap-6">
            <div className="relative h-12 w-12 flex-shrink-0">
                {isLoading ? (
                    <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300" />
                ) : (
                    <>
                        <InfluencerAvatarWithFallback
                            url={picture}
                            name={handle ?? username}
                            size={45}
                            className="rounded-full"
                        />
                        <Icon className="absolute -right-2 bottom-1 h-5 w-5" />
                    </>
                )}
            </div>
            <div>
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-40 animate-pulse bg-gray-300" />
                        <div className="h-3 w-24 animate-pulse bg-gray-300" />
                    </div>
                ) : (
                    <>
                        <div className="text-sm font-semibold text-gray-700">{fullname}</div>
                        <Link
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            data-testid="boostbot-social-profile-link"
                            onClick={() => {
                                track(OpenSocialProfile, {
                                    currentPage: CurrentPageEvent.boostbot,
                                    results_index: row.index,
                                    results_page: table.getState().pagination.pageIndex + 1,
                                    kol_id: user_id,
                                    platform,
                                    social_url: influencer.url,
                                    search_id: searchId,
                                });
                            }}
                        >
                            <span className="text-xs text-primary-600 group-hover:text-primary-800">
                                @{handle ?? username}
                            </span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};
