import { describe, expect } from 'vitest';
import { parseUserAgent } from './helpers';

describe('parseUserAgent', () => {
    // Should correctly parse user agent string for Chrome browser on Windows OS
    it('should correctly parse user agent string for Chrome browser on Windows OS', () => {
        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Chrome');
        expect(result.browser.version).toBe('91');
        expect(result.os).toBe('Windows');
    });

    // Should correctly parse user agent string for Safari browser on Mac OS
    it('should correctly parse user agent string for Safari browser on Mac OS', () => {
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Safari');
        expect(result.browser.version).toBe('14');
        expect(result.os).toBe('Mac OS');
    });

    // Should correctly parse user agent string for Firefox browser on Linux OS
    it('should correctly parse user agent string for Firefox browser on Linux OS', () => {
        const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Firefox');
        expect(result.browser.version).toBe('89');
        expect(result.os).toBe('Linux');
    });

    // Should correctly parse user agent string for Chrome browser with version number containing a dot
    it('should correctly parse user agent string for Chrome browser with version number containing a dot', () => {
        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Chrome');
        expect(result.browser.version).toBe('91');
        expect(result.os).toBe('Windows');
    });

    // Should correctly parse user agent string for Safari browser with version number containing a dot
    it('should correctly parse user agent string for Safari browser with version number containing a dot', () => {
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Safari');
        expect(result.browser.version).toBe('14');
        expect(result.os).toBe('Mac OS');
    });

    // Should correctly parse user agent string for Firefox browser with version number containing a dot
    it('should correctly parse user agent string for Firefox browser with version number containing a dot', () => {
        const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0';
        const result = parseUserAgent(userAgent);
        expect(result.browser.name).toBe('Firefox');
        expect(result.browser.version).toBe('89');
        expect(result.os).toBe('Linux');
    });
});
