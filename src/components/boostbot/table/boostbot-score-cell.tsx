import type { Row, Table } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { CreatorPlatform } from 'types';

export type BoostbotScoreCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

const engagementRateModifier = (ER: number) => {
    const lowerBound = 0.007;
    const upperBound = 0.18;

    if (lowerBound <= ER && ER <= upperBound) {
        return Math.min(0.99, 0.85 + ER);
    } else if (ER < lowerBound) {
        return Math.max(0, ER / lowerBound);
    } else {
        return Math.max(0, 0.8 - ((ER - upperBound) * 0.3) / (upperBound - lowerBound));
    }
};

const sigmoidIndex = (score: number, platform: CreatorPlatform) =>
    platform === 'youtube'
        ? 55 * (1 / (1 + Math.exp(-5 * (score - 0.48)))) + 45
        : 50 * (1 / (1 + Math.exp(-8 * (score - 0.55)))) + 50;

export const calculateIndexScore = (influencer: BoostbotInfluencer) => {
    const {
        relevance = 0.98,
        engagement_rate,
        avg_views,
        avg_reels_plays,
        followers,
        posts_count = 500,
        url,
    } = influencer;

    const platform = extractPlatformFromURL(url) ?? 'instagram';
    const isYoutube = platform === 'youtube';
    const averageViews = avg_views || avg_reels_plays || 0;

    let MF, MV, ME;
    if (isYoutube) {
        MF = followers >= 150_000 ? (200_000 - 20_000) / 150_000 : (followers - 3_000) / 100_000;
        MV = averageViews / followers + engagement_rate - 0.005 / 0.395;
        ME = 0;
    } else {
        MF = followers >= 180_000 ? (200_000 - 20_000) / 180_000 : (followers - 15_000) / 180_000;
        MV = Math.log(averageViews / followers + engagement_rate + 1);
        ME = (engagement_rate + (averageViews * 0.5) / followers) / 0.9;
    }

    MF = Math.min(Math.max(MF, 0), 1);
    MV = Math.min(Math.max(MV, 0), 1);
    ME = Math.min(1, ME);

    // Weights
    const WR = isYoutube ? 0.2 : 0.05;
    const WER = isYoutube ? 0.3 : 0.4;
    const WMV = isYoutube ? 0.25 : 0.15;
    const WMF = isYoutube ? 0.2 : 0.05;
    const WP = 0.05; // Same for both platforms
    const WME = isYoutube ? 0 : 0.3;

    const score =
        WR * relevance +
        WER * engagementRateModifier(engagement_rate) +
        WMV * MV +
        WMF * MF +
        WME * ME +
        WP * Math.min(1, posts_count / (isYoutube ? 100 : 500));

    const indexScore = Math.ceil(sigmoidIndex(score, platform));

    return indexScore;
};

export const BoostbotScoreCell = ({ row, table }: BoostbotScoreCellProps) => {
    const influencer = row.original;
    const indexScore = calculateIndexScore(influencer);
    const isLoading = table.options.meta?.isLoading;
    const bgColorClass =
        indexScore >= 70
            ? 'bg-green-100 text-green-700 border-green-50'
            : 'bg-yellow-100 text-orange-700 border-yellow-50';

    return (
        <>
            {isLoading ? (
                <div className="h-11 w-11 animate-pulse rounded-full bg-gray-300 p-2" />
            ) : (
                <div
                    className={`inline-block rounded-full border-4 p-2 text-center text-sm font-semibold ${bgColorClass}`}
                >
                    {indexScore}
                </div>
            )}
        </>
    );
};
