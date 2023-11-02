import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import { translateGeolocations } from './helpers';

const mockT = ((key: string) => {
    const translations: { [key: string]: string } = {
        'boostbot.chat.and': 'and',
        'geolocations.countries.US': 'United States',
        'geolocations.countries.CA': 'Canada',
        'geolocations.countries.GB': 'United Kingdom',
    };
    return translations[key] || key;
}) as unknown as TFunction<'translation', undefined, 'translation'>;

const mockCountries = [
    {
        id: 1,
        type: ['country'],
        name: 'United States',
        title: 'United States',
        country: { id: 1, code: 'US' },
    },
    {
        id: 2,
        type: ['country'],
        name: 'Canada',
        title: 'Canada',
        country: { id: 2, code: 'CA' },
    },
    {
        id: 3,
        type: ['country'],
        name: 'United Kingdom',
        title: 'United Kingdom',
        country: { id: 3, code: 'GB' },
    },
];

describe('translateGeolocations', () => {
    it('should return "Invalid country code" for an invalid country ID', () => {
        const mockGeolocations = [{ id: 99 }];

        expect(translateGeolocations({ geolocations: mockGeolocations, t: mockT, countries: mockCountries })).toBe(
            'Invalid country code',
        );
    });

    it('should translate single geolocation correctly', () => {
        const mockGeolocations = [{ id: 1 }];

        expect(translateGeolocations({ geolocations: mockGeolocations, t: mockT, countries: mockCountries })).toBe(
            'United States',
        );
    });

    it('should translate multiple geolocations separated by "and"', () => {
        const mockGeolocations = [{ id: 1 }, { id: 2 }];

        expect(translateGeolocations({ geolocations: mockGeolocations, t: mockT, countries: mockCountries })).toBe(
            'United States and Canada',
        );
    });

    it('should translate multiple geolocations separated by commas', () => {
        const mockGeolocations = [{ id: 1 }, { id: 2 }, { id: 3 }];

        expect(translateGeolocations({ geolocations: mockGeolocations, t: mockT, countries: mockCountries })).toBe(
            'United States, Canada, United Kingdom',
        );
    });
});
