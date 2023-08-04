import { z } from 'zod';
export { rudderstack } from './rudderstack';

// @todo refactor chatwoot events to this
export const IQDATA_SEARCH_INFLUENCERS = 'IQData Search Influencers';
export const IQDATA_GET_RELEVANT_TOPIC_TAGS = 'IQData Get Relevant Topic Tags';
export const IQDATA_LIST_TOPIC_TAGS = 'IQData List Topic Tags';
export const IQDATA_LIST_GEOLOCATIONS = 'IQData List Geolocations';
export const IQDATA_CREATE_NEW_REPORT = 'IQData Create New Report';
export const IQDATA_LIST_REPORTS = 'IQData List Reports';
export const IQDATA_FETCH_REPORT_FILE = 'IQData Fetch Report File';
export const IQDATA_GET_YOUTUBE_VIDEO_INFO = 'IQData Get Youtube Video Info';
export const IQDATA_GET_TIKTOK_MEDIA_INFO = 'IQData Get Youtube Media Info';

export const eventKeys = z.union([
    z.literal(IQDATA_SEARCH_INFLUENCERS),
    z.literal(IQDATA_GET_RELEVANT_TOPIC_TAGS),
    z.literal(IQDATA_LIST_TOPIC_TAGS),
    z.literal(IQDATA_LIST_GEOLOCATIONS),
    z.literal(IQDATA_CREATE_NEW_REPORT),
    z.literal(IQDATA_LIST_REPORTS),
    z.literal(IQDATA_FETCH_REPORT_FILE),
    z.literal(IQDATA_GET_YOUTUBE_VIDEO_INFO),
    z.literal(IQDATA_GET_TIKTOK_MEDIA_INFO),
]);
