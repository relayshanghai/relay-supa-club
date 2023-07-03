import type { Journey } from '../types';

export const SEARCH_JOURNEY_NAME = 'search';

export const searchJourney = (): Journey => {
    return {
        onStart: (id, payload) => {
            // eslint-disable-next-line no-console
            console.log('start search journey', id, payload);
        },
        onEnd: (id, payload) => {
            // eslint-disable-next-line no-console
            console.log('end search journey', id, payload);
        },
    };
};
