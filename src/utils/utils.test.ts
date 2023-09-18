import { describe, expect, it, test } from 'vitest';
import {
    chinaFilter,
    isAdmin,
    isValidUrl,
    languageCodeToHumanReadable,
    numFormatter,
    toCurrency,
    truncateWithDots,
} from './utils';

describe('numformatter', () => {
    it("should return '-' if zero or NaN", () => {
        expect(numFormatter(0)).toBe('-');
        expect(numFormatter(NaN)).toBe('-');
    });
    it('should return string', () => {
        expect(typeof numFormatter(1)).toBe('string');
    });

    it("should return format to 'billions'", () => {
        expect(numFormatter(1000000000)).toBe('1.0B');
        expect(numFormatter(1010000000)).toBe('1.0B');
        expect(numFormatter(1100000000)).toBe('1.1B');
        expect(numFormatter(999900000000)).toBe('999.9B');
    });

    it("should return format to 'millions' ", () => {
        expect(numFormatter(1000000)).toBe('1.0M');
        expect(numFormatter(1010000)).toBe('1.0M');
        expect(numFormatter(1100000)).toBe('1.1M');
        expect(numFormatter(999900000)).toBe('999.9M');
    });

    it("should return format to 'thousands' ", () => {
        expect(numFormatter(1000)).toBe('1.0K');
        expect(numFormatter(1010)).toBe('1.0K');
        expect(numFormatter(1100)).toBe('1.1K');
        expect(numFormatter(999900)).toBe('999.9K');
    });

    it.todo('should round to 1 decimal place');
    // it('should round to 1 decimal place', () => {
    //     expect(numFormatter(999990000000)).toBe('1000.0B');
    //     expect(numFormatter(999990000)).toBe('1B');
    //     expect(numFormatter(999990)).toBe('1M');
    // });

    it.todo('should return to negative');
    // it('should return to negative', () => {
    //     expect(numFormatter(-1)).toBe('-1');
    //     expect(numFormatter(-1000000000)).toBe('-1000000000');
    //     expect(numFormatter(-Infinity)).toBe('-Infinity');
    // });

    it('can handle e-notations', () => {
        expect(numFormatter(1.23e20)).toBe('123000000000.0B');
        expect(numFormatter(1.23e-10)).toBe('1.23e-10');
    });
});

describe('isValidUrl', () => {
    test.each([
        'https://www.google.com',
        'https://www.google.com/search?q=url+validation',
        'http://example.com',
        'https://example.com',
        'http://sub.example.com',
        'https://sub.example.com',
        'http://example.com:8080',
        'https://example.com:8443',
        'http://127.0.0.1',
        'https://127.0.0.1',
    ])('should return true for %s', (v) => {
        expect(isValidUrl(v)).toBe(true);
    });

    test.each([
        'http://',
        'http://.',
        'http://..',
        'htp://example.com',
        'http:/example.com',
        'http//example.com',
        'http:///example.com',
    ])('should return false for %s', (v) => {
        expect(isValidUrl(v)).toBe(false);
    });
});

describe('chinaFilter', () => {
    it("should return 'N/A' for empty strings", () => {
        expect(chinaFilter('')).toBe('N/A');
    });

    it('should return formatted for Taiwan', () => {
        // expect(chinaFilter('taiwan')).toBe('China (Taiwan)')
        expect(chinaFilter('Taiwan')).toBe('China (Taiwan)');
        // expect(chinaFilter('TAIWAN')).toBe('China (Taiwan)')
    });

    it('should return formatted for Hong Kong', () => {
        // expect(chinaFilter('hong kong')).toBe('China (Hong Kong)')
        expect(chinaFilter('Hong Kong')).toBe('China (Hong Kong)');
        // expect(chinaFilter('HONG KONG')).toBe('China (Hong Kong)')
    });

    it('should return unformatted', () => {
        expect(chinaFilter('Japan')).toBe('Japan');
        expect(chinaFilter('Philippines')).toBe('Philippines');
        expect(chinaFilter('Singapore')).toBe('Singapore');
    });
});

describe('toCurrency', () => {
    it('should throw if invalid currency', () => {
        expect(() => toCurrency(0, 2, 'XXXX')).toThrowError();
    });

    it('should return USD currency', () => {
        expect(toCurrency(100)).toBe('$100.00');
    });

    it('should return CNY currency', () => {
        expect(toCurrency(100, 2, 'CNY')).toBe('CN¥100.00');
    });
});

describe('truncateWithDots', () => {
    it('should return empty string', () => {
        expect(truncateWithDots('', 10)).toBe('');
        expect(truncateWithDots(undefined, 10)).toBe('');
        expect(truncateWithDots(null, 10)).toBe('');
    });

    it('should return same string', () => {
        expect(truncateWithDots('foo', 10)).toBe('foo');
        expect(truncateWithDots('foobarbaz', 9)).toBe('foobarbaz');
    });

    it('should return truncated string', () => {
        expect(truncateWithDots('foo bar baz boom', 10)).toBe('foo bar ba...');
        expect(truncateWithDots('foobarbaz.', 9)).toBe('foobarbaz...');
    });
});

describe('isAdmin', () => {
    it('should return false if role is not provided', () => {
        expect(isAdmin()).toBe(false);
    });

    it('should return true', () => {
        expect(isAdmin('company_owner')).toBe(true);
        expect(isAdmin('relay_employee')).toBe(true);
        expect(isAdmin('relay_expert')).toBe(true);
    });
});

describe('unixEpochToISOString', () => {
    it.todo('tests for unixEpochToISOString');
});

describe('isMissing', () => {
    it.todo('tests for isMissing');
});

describe('languageCodeToHumanReadable', () => {
    it('should return human readable language', () => {
        const english = languageCodeToHumanReadable('en-US');
        expect(english).toBe('English');
        const englishUK = languageCodeToHumanReadable('en-GB');
        expect(englishUK).toBe('English');

        const chinese = languageCodeToHumanReadable('zh-CN');
        expect(chinese).toBe('Chinese');
        const chineseHK = languageCodeToHumanReadable('zh-HK');
        expect(chineseHK).toBe('Chinese');

        const unhandled = languageCodeToHumanReadable('foo');
        expect(unhandled).toBe('foo');
    });
});
