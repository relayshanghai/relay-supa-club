import { searchJourney, SEARCH_JOURNEY_NAME } from './search';

const journeys = {
    [SEARCH_JOURNEY_NAME]: searchJourney,
};

export const journeyKeys = [SEARCH_JOURNEY_NAME];

export default journeys;
