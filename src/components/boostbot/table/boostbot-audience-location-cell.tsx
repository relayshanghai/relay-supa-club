import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Tooltip } from 'src/components/library';
import { decimalToPercent } from 'src/utils/formatter';
import type { Countries } from 'types/iqdata/influencer-search-request-body';

export type BoostbotAudienceLocationCellProps = {
    row: Row<BoostbotInfluencer>;
};

export type BoostbotAudienceGeoType = {
    countries: Countries[];
};

export const renderAudienceGeo = (audienceGeo: BoostbotAudienceGeoType) => {
    const countries = audienceGeo.countries;
    // the audienceGeo only returns 2 countries back at most
    const top1CountryWeight = countries[0] ? countries[0].weight : 0;
    const top2CountryWeight = countries[1] ? countries[1].weight : 0;

    // convert the weight to a percentage for the two countries
    const top1CountryPercentage = decimalToPercent(top1CountryWeight, 0);
    const top2CountryPercentage = decimalToPercent(top2CountryWeight, 0);

    // the second country width is the sum of the first and second country so it shows up in the right place
    const top2CountryWidth =
        top1CountryWeight && countries[1] ? decimalToPercent(top1CountryWeight + top2CountryWeight, 0) : 0;

    return (
        <div className="relative w-[120px]">
            <div className=" h-2 rounded-lg bg-gray-200" />
            {countries.length > 0 && (
                <Tooltip
                    content={`${countries[0].name} ${top1CountryPercentage}`}
                    contentSize="small"
                    position="bottom-left"
                >
                    <div
                        className="absolute left-0 top-0 z-10 h-2 rounded-lg bg-primary-600"
                        data-testid="boostbot-location-cell-country-1"
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
                        className="absolute left-0 top-0 z-0 h-2 rounded-lg bg-primary-300"
                        style={{ width: top2CountryWidth || '0%' }}
                    />
                </Tooltip>
            )}
        </div>
    );
};

export const BoostbotAudienceLocationCell = ({ row }: BoostbotAudienceLocationCellProps) => {
    const influencer = row.original;
    const audienceGeo = influencer.audience_geo;
    if (!audienceGeo) {
        return null;
    }
    return <div>{renderAudienceGeo(audienceGeo)}</div>;
};
