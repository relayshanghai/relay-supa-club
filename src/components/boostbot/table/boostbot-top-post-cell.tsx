import { Bars3BottomLeftIcon, EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import type { Row, Table } from '@tanstack/react-table';
import Link from 'next/link';
import type { Influencer } from 'pages/boostbot';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSocialThumbnails } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { numberFormatter } from 'src/utils/formatter';

export type BoostbotTopPostsCellProps = {
    row: Row<Influencer>;
    table: Table<Influencer>;
};

export const BoostbotTopPostsCell = ({ row, table }: BoostbotTopPostsCellProps) => {
    const influencer = row.original;
    const posts = 'top_posts' in influencer && influencer.top_posts && influencer.top_posts.slice(0, 3);
    const description = 'description' in influencer && influencer.description;
    const topicsList = influencer.topics.map((topic) => `#${topic}`).join(', ');
    const { track } = useRudderstackTrack();
    // @note get platform from url for now
    //       `influencer` was supposed to be `UserAccount` type which contains `type` for platform but it's not there on runtime
    const platform = influencer.url.includes('youtube')
        ? 'youtube'
        : influencer.url.includes('tiktok')
        ? 'tiktok'
        : 'instagram';

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                {posts ? (
                    posts.map((post, index) => (
                        <Link
                            key={post.post_id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-40 w-40 flex-col overflow-hidden rounded-md border"
                            onClick={() => {
                                track(OpenSocialThumbnails, {
                                    currentPage: CurrentPageEvent.boostbot,
                                    is_unlocked: true,
                                    results_index: row.index,
                                    thumbnail_index: index,
                                    kol_id: influencer.user_id,
                                    platform,
                                    social_url: influencer.url,
                                    search_id: table.options.meta?.searchId ?? null,
                                });
                            }}
                        >
                            <div className="flex-1 overflow-hidden">
                                <img
                                    src={post.thumbnail}
                                    alt={post.text}
                                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                                />
                            </div>
                            <div className="flex justify-between p-2 text-xs">
                                <div className="flex items-center gap-0.5">
                                    <EyeIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                    {numberFormatter(post.stat.plays || post.stat.views) ?? '-'}
                                </div>
                                <div className="flex items-center gap-1">
                                    <HandThumbUpIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                    {numberFormatter(post.stat.likes) ?? '-'}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <>
                        <div
                            className="h-40 w-40 bg-primary-200 blur-sm"
                            onClick={() => {
                                track(OpenSocialThumbnails, {
                                    currentPage: CurrentPageEvent.boostbot,
                                    is_unlocked: false,
                                    results_index: row.index,
                                    thumbnail_index: 0,
                                    kol_id: influencer.user_id,
                                    platform,
                                    social_url: influencer.url,
                                    search_id: table.options.meta?.searchId ?? null,
                                });
                            }}
                        />
                        <div
                            className="h-40 w-40 bg-primary-200 blur-sm"
                            onClick={() => {
                                track(OpenSocialThumbnails, {
                                    currentPage: CurrentPageEvent.boostbot,
                                    is_unlocked: false,
                                    results_index: row.index,
                                    thumbnail_index: 1,
                                    kol_id: influencer.user_id,
                                    platform,
                                    social_url: influencer.url,
                                    search_id: table.options.meta?.searchId ?? null,
                                });
                            }}
                        />
                        <div
                            className="h-40 w-40 bg-primary-200 blur-sm"
                            onClick={() => {
                                track(OpenSocialThumbnails, {
                                    currentPage: CurrentPageEvent.boostbot,
                                    is_unlocked: false,
                                    results_index: row.index,
                                    thumbnail_index: 2,
                                    kol_id: influencer.user_id,
                                    platform,
                                    social_url: influencer.url,
                                    search_id: table.options.meta?.searchId ?? null,
                                });
                            }}
                        />
                    </>
                )}
            </div>

            {description ? (
                <p className="flex max-w-[490px] flex-grow-0 gap-1 text-xs">
                    <Bars3BottomLeftIcon className="h-4 w-4 flex-shrink-0" /> {description}
                </p>
            ) : null}

            <div className="border-b border-gray-200" />
            <p className="ml-2 text-xs">{topicsList}</p>
        </div>
    );
};
