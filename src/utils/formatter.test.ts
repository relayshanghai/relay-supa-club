import { describe, expect, it } from 'vitest';
import { numberFormatter, decimalToPercent } from './formatter';

describe('numberFormatter', () => {
    it('should return null if an invalid or blank number is provided', () => {
        expect(numberFormatter()).toBeNull();
        expect(numberFormatter('')).toBeNull();
        expect(numberFormatter('abc')).toBeNull();
        expect(numberFormatter('123abc')).toBeNull();

        expect(numberFormatter(1)).not.toBeNull();
        expect(numberFormatter(1.1)).not.toBeNull();
    });
    it('should parse valid number strings', () => {
        expect(numberFormatter('1')).toBe('1');
        expect(numberFormatter('1.1')).toBe('1.1');
    });
    it('should format large numbers with abbreviations and use two decimals after zero max', () => {
        expect(numberFormatter(1000)).toBe('1K');
        expect(numberFormatter(1000000)).toBe('1M+');
        expect(numberFormatter(1000000000)).toBe('1B+');
        expect(numberFormatter(1000000000000)).toBe('1T+');
        // decimals
        expect(numberFormatter(1222.22)).toBe('1.22K');
        expect(numberFormatter(1333300)).toBe('1.33M+');
    });
    it('should not return zero as null', () => {
        expect(numberFormatter(0)).toBe('0');
        expect(numberFormatter('0')).toBe('0');
    });
    it('can handle negative numbers', () => {
        expect(numberFormatter(-1000)).toBe('-1K');
        expect(numberFormatter(-1000000)).toBe('-1M');
        expect(numberFormatter(-1000000000)).toBe('-1B');
        expect(numberFormatter(-1000000000000)).toBe('-1T');
        // decimals
        expect(numberFormatter(-1222.22)).toBe('-1.22K');
        expect(numberFormatter(-1333300)).toBe('-1.33M');
    });
});

describe('decimalToPercent', () => {
    it('should return null if an invalid or blank number is provided', () => {
        expect(decimalToPercent()).toBeNull();
        expect(decimalToPercent('')).toBeNull();
        expect(decimalToPercent('abc')).toBeNull();
        expect(decimalToPercent('123abc')).toBeNull();

        expect(decimalToPercent(1)).not.toBeNull();
        expect(decimalToPercent(1.1)).not.toBeNull();
    });
    it('converts a decimal to a percent, assuming that the decimal is a base 100 percent, e.g. .15 -> 15%, 1.5 -> 150%', () => {
        expect(decimalToPercent(0)).toBe('0%');
        expect(decimalToPercent('0')).toBe('0%');
        expect(decimalToPercent(0.15)).toBe('15%');
        expect(decimalToPercent(0.123)).toBe('12.3%');
        expect(decimalToPercent(1.5)).toBe('150%');
        expect(decimalToPercent(1.2345)).toBe('123.45%');
    });
    it('uses two decimals after the zero max and rounds the last', () => {
        expect(decimalToPercent(0.123456)).toBe('12.35%');
    });
});
