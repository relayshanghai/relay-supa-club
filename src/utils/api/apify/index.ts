import { handleResError } from 'src/utils/fetcher';
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
                  'Content-Type': 'application/json',
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

const youtubeSraperEndpoint = 'acts/bernardo~youtube-scraper/run-sync-get-dataset-items';

/** url should be  a full youtube link like https://www.youtube.com/watch?v=y3Umo_jd5AA&feature=youtu.be */
const prepareYoutubeScrapeParams = (url: string) => ({
    startUrls: [{ url }],
    simplifiedInformation: true,
    maxResults: 1,
});

export const fetchYoutubeVideoInfo = async (url: string) =>
    apifyFetch<YoutubeVideoScrapeRaw>(youtubeSraperEndpoint, {
        method: 'post',
        body: JSON.stringify(prepareYoutubeScrapeParams(url)),
    });
