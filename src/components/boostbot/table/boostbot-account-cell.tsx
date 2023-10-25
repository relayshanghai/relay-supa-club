import { useTranslation } from 'react-i18next';
import { UsersIcon } from '@heroicons/react/24/solid';
import type { Row, Table } from '@tanstack/react-table';
import Link from 'next/link';
import type { Influencer } from 'pages/boostbot';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenSocialProfile, OpenAnalyzeProfile } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { numberFormatter } from 'src/utils/formatter';
import { Button } from 'src/components/button';

export type BoostbotAccountCellProps = {
    row: Row<Influencer>;
    table: Table<Influencer>;
};

export const BoostbotAccountCell = ({ row, table }: BoostbotAccountCellProps) => {
    const { t } = useTranslation();
    const influencer = row.original;
    const { username, custom_name, fullname, url = '', picture, followers, user_id } = influencer;
    const handle = username || custom_name || fullname || '';
    const Icon = url.includes('youtube') ? Youtube : url.includes('tiktok') ? Tiktok : Instagram;
    const { track } = useRudderstackTrack();
    // @note get platform from url for now
    //       `influencer` was supposed to be `UserAccount` type which contains `type` for platform but it's not there on runtime
    const platform = url.includes('youtube') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';

    return (
        <div className="flex flex-col items-center gap-2">
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-xs"
                data-testid="boostbot-social-profile-link"
                onClick={() => {
                    track(OpenSocialProfile, {
                        currentPage: CurrentPageEvent.boostbot,
                        results_index: row.index,
                        results_page: table.getState().pagination.pageIndex + 1,
                        kol_id: user_id,
                        platform,
                        social_url: influencer.url,
                        search_id: table.options.meta?.searchId ?? null,
                    });
                }}
            >
                <div className="flex flex-col items-center gap-0.5">
                    <div className="relative mb-2 h-20 w-20 transition-all group-hover:scale-105">
                        <img className="h-full w-full rounded-full object-cover" src={picture} alt={handle} />
                        <Icon className="absolute -right-2 bottom-1 h-8 w-8" />
                    </div>
                    <div className="font-bold leading-4 text-gray-900">{fullname}</div>
                    <span className="text-primary-500 group-hover:underline">{handle ? `@${handle}` : null}</span>
                    <p
                        className="flex items-center gap-1 text-base text-gray-900"
                        title={table.options.meta?.t('boostbot.table.followers')}
                    >
                        <UsersIcon className="h-5 w-5 flex-shrink-0 fill-slate-700" />
                        {numberFormatter(followers) ?? '-'}
                    </p>
                </div>
            </Link>

            <Link
                href={`/influencer/${encodeURIComponent(platform)}/${encodeURIComponent(user_id)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="boostbot-analyze-profile-link"
                onClick={() => track(OpenAnalyzeProfile, { currentPage: CurrentPageEvent.boostbot, platform, user_id })}
            >
                <Button className="flex flex-row items-center" variant="secondary">
                    <span className="">{t('creators.analyzeProfile')}</span>
                </Button>
            </Link>
        </div>
    );
};
