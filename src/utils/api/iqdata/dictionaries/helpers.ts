import type { TFunction } from 'i18next';
import type { Country } from 'src/utils/api/iqdata/dictionaries/geolocations';
import type { AudienceGeo } from 'types/iqdata/influencer-search-request-body';

export const translateGeolocations = ({
    geolocations,
    countries,
    t,
}: {
    geolocations: AudienceGeo[];
    countries: Country[];
    t: TFunction<'translation', undefined, 'translation'>;
}) => {
    // The string type is a fallback for already existing messages in users' indexedDBs from when this feature was not yet implemented.
    if (typeof geolocations === 'string') return geolocations;

    const and = t('boostbot.chat.and');

    const getTranslatedCountryName = (id: number) => {
        const countryCode = countries.find((country) => country.id === id)?.country.code;
        if (!countryCode) return 'Invalid country code';
        return t(`geolocations.countries.${countryCode}`);
    };
    const translatedCountries = geolocations.map((geolocation) => getTranslatedCountryName(geolocation.id));

    if (translatedCountries.length === 2) {
        return translatedCountries.join(` ${and} `);
    } else {
        return translatedCountries.join(', ');
    }
};
