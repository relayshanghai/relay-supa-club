import { handleResError } from 'src/utils/fetcher';
import type { InstagramPostScrape } from 'types/apify/instagram-post-scrape';
import type { YoutubeVideoScrapeRaw } from 'types/apify/youtube-video-scrape';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
    throw new Error('APIFY_TOKEN is not defined');
}
const APIFY_URL = 'https://api.apify.com/v2/';

export const apifyFetch = async <T = any>(path: string, options: RequestInit = {}) => {
    const headers =
        options.method === 'post' || options.method === 'put'
            ? {
                  ...options.headers,
                  'content-type': 'application/json',
              }
            : options.headers || {};

    const res = await fetch(
        `${APIFY_URL}${path}?${new URLSearchParams({
            token: APIFY_TOKEN,
        })}`,
        {
            ...options,
            headers,
        },
    );
    await handleResError(res);
    const json = await res.json();
    return json as T;
};

const youtubeScraperEndpoint = 'acts/bernardo~youtube-scraper/run-sync-get-dataset-items';

/** url should be  a full youtube link like https://www.youtube.com/watch?v=y3Umo_jd5AA&feature=youtu.be */
const prepareYoutubeScrapeParams = (url: string) => ({
    startUrls: [{ url }],
    simplifiedInformation: true,
    maxResults: 1,
});

export const fetchYoutubeVideoInfo = async (url: string) =>
    apifyFetch<YoutubeVideoScrapeRaw>(youtubeScraperEndpoint, {
        method: 'post',
        body: JSON.stringify(prepareYoutubeScrapeParams(url)),
    });

const instagramPostScraperEndpoint = 'acts/apify~instagram-scraper/run-sync-get-dataset-items';

const prepareInstagramPostScrapeParams = (url: string) => ({
    directUrls: [url],
    proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL'],
    },
    resultsType: 'details',
    resultsLimit: 1,
    maxRequestRetries: 3,
});

export const fetchInstagramPostInfo = async (url: string) =>
    apifyFetch<InstagramPostScrape>(instagramPostScraperEndpoint, {
        method: 'post',
        body: JSON.stringify(prepareInstagramPostScrapeParams(url)),
    });
