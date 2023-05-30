import { extractPlatformFromURL } from './extract-platform-from-url';
import { describe, it, expect } from 'vitest';
const youtubeLink = 'https://www.youtube.com/watch?v=UzL-0vZ5-wk';
const youtubeLink2 = 'https://youtu.be/UzL-0vZ5-wk';
const instagramLink = 'https://www.instagram.com/p/Cr3aeZ7NXW3/';
const tiktokLink =
    'https://www.tiktok.com/@graceofearth/video/7230816093755936043?_r=1&_t=8c9DNKVO2Tm&social_sharing=v2';
const tiktokM = 'https://vm.tiktok.com/@graceofearth/video/7230816093755936043?_r=1&_t=8c9DNKVO2Tm&social_sharing=v2';
const tiktokT = 'https://vt.tiktok.com/@graceofearth/video/7230816093755936043?_r=1&_t=8c9DNKVO2Tm&social_sharing=v2';

describe('extractPlatformFromURL', () => {
    it('should return "youtube" for a valid YouTube URL', () => {
        expect(extractPlatformFromURL(youtubeLink)).toEqual('youtube');
        expect(extractPlatformFromURL(youtubeLink2)).toEqual('youtube');
    });

    it('should return "instagram" for a valid Instagram URL', () => {
        expect(extractPlatformFromURL(instagramLink)).toEqual('instagram');
    });

    it('should return "tiktok" for a valid TikTok URL', () => {
        expect(extractPlatformFromURL(tiktokLink)).toEqual('tiktok');
        expect(extractPlatformFromURL(tiktokM)).toEqual('tiktok');
        expect(extractPlatformFromURL(tiktokT)).toEqual('tiktok');
    });

    it('should return null for an invalid URL', () => {
        const url = 'https://www.example.com';
        expect(extractPlatformFromURL(url)).toBeNull();
    });

    it('should return null for an unsupported platform URL', () => {
        const url = 'https://www.facebook.com';
        expect(extractPlatformFromURL(url)).toBeNull();
    });
});
