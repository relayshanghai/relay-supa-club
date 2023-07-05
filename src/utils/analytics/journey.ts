import { setItem, getItem, removeItem } from '@analytics/storage-utils';
import { nanoid } from 'nanoid';
import journeys from './journeys';
import type { JourneyCollection, JourneyObject } from './types';
import { JourneyStatus } from './types';
import { JOURNEY_COOKIE_NAME } from 'src/utils/analytics/constants';
import { setCookie } from 'cookies-next';

const JOURNEY_STORAGE_KEY = 'relay.journey';

type JourneyIndex = { id: string; name: string }[];

type JourneyTypes = keyof typeof journeys;

export const updateJourneyCookie = (journey: JourneyObject) => {
    setCookie(JOURNEY_COOKIE_NAME, JSON.stringify(journey), { path: '/' });
};

export const getCurrentJourneyId = () => {
    return getItem<string>(`${JOURNEY_STORAGE_KEY}.current`);
};

export const setCurrentJourneyId = (id: string) => {
    return setItem<string>(`${JOURNEY_STORAGE_KEY}.current`, id);
};

/**
 * Gets the a Journey
 *
 *  Uses current journey if no ID is provided.
 *
 * @param  {string}  [id] Journey ID
 */
export const getJourney = (id?: string) => {
    const current = id ?? getCurrentJourneyId();
    return getItem<JourneyObject>(`${JOURNEY_STORAGE_KEY}.${current}`);
};

export const end = (journeys: JourneyCollection) => (payload?: any) => {
    const item = getJourney();
    if (!item) return false;

    const updated = setItem<JourneyObject>(`${JOURNEY_STORAGE_KEY}.${item.id}`, {
        ...item,
        status: JourneyStatus.ENDED,
        updated_at: new Date().getTime(),
    });
    updateJourneyCookie(updated.current);

    const { onEnd } = journeys[updated.current.name]();

    if (onEnd) {
        return onEnd(updated.current, payload);
    }

    return updated.current;
};

export const abort = (journeys: JourneyCollection) => (payload?: any) => {
    const item = getJourney();
    if (!item) return false;

    const updated = setItem<JourneyObject>(`${JOURNEY_STORAGE_KEY}.${item.id}`, {
        ...item,
        status: JourneyStatus.ABORTED,
        updated_at: new Date().getTime(),
    });
    updateJourneyCookie(updated.current);

    const { onAbort } = journeys[updated.current.name]();

    if (onAbort) {
        return onAbort(updated.current, payload);
    }

    return updated.current;
};

export const update = (journeys: JourneyCollection) => (payload?: any, tag?: string) => {
    const item = getJourney();
    if (!item) return false;

    const updated = setItem<JourneyObject>(`${JOURNEY_STORAGE_KEY}.${item.id}`, {
        ...item,
        updated_at: new Date().getTime(),
        tag,
    });
    updateJourneyCookie(updated.current);

    const { onUpdate } = journeys[updated.current.name]();

    if (onUpdate) {
        return onUpdate(updated.current, { ...payload, __tag: tag });
    }

    return updated.current;
};

export const start = (journeys: JourneyCollection) => (name: JourneyTypes, payload?: any, tag?: string) => {
    const id = nanoid();

    const previous = abort(journeys)();

    const timestamp = new Date().getTime();
    const key = `${JOURNEY_STORAGE_KEY}.${id}`;

    const item = setItem<JourneyObject>(key, {
        id,
        name,
        status: JourneyStatus.ONGOING,
        created_at: timestamp,
        updated_at: timestamp,
        tag,
    });
    setCurrentJourneyId(item.current.id);
    updateJourneyCookie(item.current);

    const index = getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`) ?? [];
    setItem(`${JOURNEY_STORAGE_KEY}.__index`, [...index, { id, name }]);

    const { onStart } = journeys[name]();

    if (onStart) {
        return onStart(item.current, { ...payload, __tag: tag, __previous: previous });
    }

    return item.current;
};

/**
 * Get journey index
 */
export const listJourneys = () => getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`);

/**
 * Clears all journeys
 */
export const clearJourneys = () => {
    const index = getItem<JourneyIndex>(`${JOURNEY_STORAGE_KEY}.__index`);

    if (!index) return;

    index.forEach(({ id }) => {
        removeItem(`${JOURNEY_STORAGE_KEY}.${id}`);
    });

    removeItem(`${JOURNEY_STORAGE_KEY}.__index`);
};

/**
 * Starts a new journey
 *
 *  Creating journeys will abort the previous journey.
 *  Previously aborted journey is accessible via `payload.__previous`.
 *
 * @param  {JourneyTypes} journeys The name of the journey
 * @param  {Any} [payload] An key-value object that is passed in the journey's onStart callback
 * @param  {string} [tag] A tag for providing extra metadata stored in the journey. Accessible in payload via `payload.__tag`
 */
export const startJourney = start(journeys);

/**
 * Update current journey
 *
 * @param  {Any} [payload] An key-value object that is passed in the journey's onUpdate callback
 * @param  {string} [tag] A tag for providing extra metadata stored in the journey. Accessible in payload via `payload.__tag`
 */
export const updateJourney = update(journeys);

/**
 * Ends the current journey
 *
 *  Sets the journey status to `ended`
 *
 * @param  {Any} [payload] An key-value object that is passed in the journey's onEnd callback
 */
export const endJourney = end(journeys);

/**
 * Aborts the current journey
 *
 *  Sets the journey status to `aborted`
 *
 * @param  {Any} [payload] An key-value object that is passed in the journey's onAbort callback
 */
export const abortJourney = abort(journeys);
