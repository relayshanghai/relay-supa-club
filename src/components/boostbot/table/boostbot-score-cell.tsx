import type { Row, Table } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';

export type BoostbotScoreCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

export const calculateIndexScore = (influencer: BoostbotInfluencer) => {
    const { relevance, engagement_rate, avg_views, avg_reels_plays, followers, engagements, posts_count } = influencer;

    const averageViews = avg_views || avg_reels_plays || 0;

    const MF = Math.exp(-Math.pow((followers - 75000) / 46619.5, 2));
    const MER = Math.exp(-Math.pow((engagement_rate - 0.02) / 0.0127, 2));
    const MV = averageViews / followers;

    const wR = 0.3;
    const wER = 0.25;
    const wV = 0.2;
    const wE = 0.1;
    const wF = 0.1;
    const wP = 0.05;

    const score =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        wR * relevance! +
        wER * MER * engagement_rate +
        wV * MV +
        wE * (engagements / followers) +
        wF * MF +
        // We know that posts_count exist for Boostbot influencers because we are fetching for it in the src/utils/api/boostbot/index.ts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        wP * posts_count!;

    // I found that tweaking these 2 values has visible impact
    const slope = 0.1;
    const inflectionPoint = 0.5;

    const indexScore = 88 / (1 + Math.exp(-slope * (score - inflectionPoint))) + 10;

    return Math.ceil(indexScore);
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
