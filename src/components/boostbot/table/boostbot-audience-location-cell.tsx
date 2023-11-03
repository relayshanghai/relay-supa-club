import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Tooltip } from 'src/components/library';
import { decimalToPercent } from 'src/utils/formatter';

export type BoostbotAudienceLocationCellProps = {
    row: Row<BoostbotInfluencer>;
};

export const renderAudienceGeo = (audienceGeo: any) => {
    if (!audienceGeo) {
        return null;
    }

    const countries = audienceGeo.countries;
    const top1CountryPercentage = countries[0] ? decimalToPercent(countries[0].weight, 0) : null;
    const top2CountryPercentage = countries[1] ? decimalToPercent(countries[1].weight, 0) : null;

    return (
        <div className="relative">
            <div className=" -z-10 h-2 w-[100px] rounded-lg bg-gray-200" />
            {countries.length > 0 && (
                <Tooltip
                    content={`${countries[0].name} ${top1CountryPercentage}`}
                    contentSize="small"
                    position="bottom-left"
                >
                    <div
                        className="absolute left-0 top-0 z-0 h-2 rounded-lg bg-primary-300"
                        style={{ width: top1CountryPercentage || '0%' }}
                    />
                </Tooltip>
            )}
            {countries.length > 1 && (
                <Tooltip
                    content={`${countries[1].name} ${top2CountryPercentage}`}
                    contentSize="small"
                    position="bottom-left"
                >
                    <div
                        className="absolute left-0 top-0 z-10 h-2 w-12 rounded-lg bg-primary-600"
                        style={{ width: top2CountryPercentage || '0%' }}
                    />
                </Tooltip>
            )}
        </div>
    );
};

export const BoostbotAudienceLocationCell = ({ row }: BoostbotAudienceLocationCellProps) => {
    const influencer = row.original;
    const audienceGeo = influencer.audience_geo;

    return <div>{renderAudienceGeo(audienceGeo)}</div>;
};
