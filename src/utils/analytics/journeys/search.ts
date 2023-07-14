import type { Journey } from '../types';

export const SEARCH_JOURNEY_NAME = 'search';

export const searchJourney = (): Journey => {
    return {
        onStart: (_id, _payload) => {
            // @todo to implement
        },
        onEnd: (_id, _payload) => {
            // @todo to implement
        },
    };
};
